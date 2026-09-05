const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Report = require("../models/Report");
const ReportVersion = require("../models/ReportVersion");
const { REPORT_STATUS } = require("../utils/constants");

/**
 * Helper: check validation errors
 */
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return { message: "Validation failed", errors: errors.array() };
  }
  return null;
};

/**
 * Helper: ensure only one key blocker / key achievement
 */
const normalizeKeyFlags = (reportBody) => {
  if (Array.isArray(reportBody.blockers)) {
    let seen = false;
    reportBody.blockers = reportBody.blockers.map((b) => {
      const isKey = Boolean(b.isKeyIssue);
      if (isKey && !seen) {
        seen = true;
        return { ...b, isKeyIssue: true };
      }
      return { ...b, isKeyIssue: false };
    });
  }

  if (Array.isArray(reportBody.achievements)) {
    let seen = false;
    reportBody.achievements = reportBody.achievements.map((a) => {
      const isKey = Boolean(a.isKeyAchievement);
      if (isKey && !seen) {
        seen = true;
        return { ...a, isKeyAchievement: true };
      }
      return { ...a, isKeyAchievement: false };
    });
  }

  return reportBody;
};

/**
 * POST /api/reports
 * Member: create a report as Draft (or overwrite draft if exists for same weekStart)
 */
const createReport = async (req, res, next) => {
  try {
    const bad = checkValidation(req, res);
    if (bad) return res.json(bad);

    const userId = req.user.id;
    const {
      project,
      weekStart,
      weekEnd,
      categoryTag = "",
      tasksCompleted = [],
      tasksPlannedNextWeek = [],
      blockers = [],
      achievements = [],
      hoursBreakdown = {},
      notes = "",
    } = normalizeKeyFlags(req.body);

    // Unique index is { user, weekStart } so this will prevent duplicates
    const report = await Report.create({
      user: userId,
      project,
      weekStart,
      weekEnd,
      categoryTag,
      tasksCompleted,
      tasksPlannedNextWeek,
      blockers,
      achievements,
      hoursBreakdown,
      notes,
      status: REPORT_STATUS.DRAFT,
      currentVersion: 1,
    });

    res.status(201).json({ message: "Report created (Draft)", report });
  } catch (err) {
    // Duplicate weekStart for same user
    if (err.code === 11000) {
      res.status(409);
      return res.json({ message: "Report already exists for this weekStart" });
    }
    next(err);
  }
};

/**
 * GET /api/reports/my
 * Member: list own reports with filters + pagination
 * Query: page, limit, status, project, from, to
 */
const getMyReports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      project,
      from,
      to,
    } = req.query;

    const filter = { user: userId };

    if (status) filter.status = status;
    if (project) filter.project = project;

    if (from || to) {
      filter.weekStart = {};
      if (from) filter.weekStart.$gte = new Date(from);
      if (to) filter.weekStart.$lte = new Date(to);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Report.find(filter)
        .sort({ weekStart: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("project", "name color")
        .lean(),
      Report.countDocuments(filter),
    ]);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      items,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:id
 * Member: can view only own report
 * Manager/Admin: can view any report (we will also use this endpoint for them)
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      return res.json({ message: "Invalid report id" });
    }

    const report = await Report.findById(id)
      .populate("user", "name email role")
      .populate("project", "name color")
      .lean();

    if (!report) {
      res.status(404);
      return res.json({ message: "Report not found" });
    }

    // If member, must own it
    if (req.user.role === "member" && String(report.user._id) !== String(req.user.id)) {
      res.status(403);
      return res.json({ message: "Forbidden" });
    }

    res.json({ report });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reports/:id
 * Member: edit report only if Draft or Needs Correction
 */
const updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bad = checkValidation(req, res);
    if (bad) return res.json(bad);

    const report = await Report.findById(id);
    if (!report) {
      res.status(404);
      return res.json({ message: "Report not found" });
    }

    // must own it
    if (String(report.user) !== String(req.user.id)) {
      res.status(403);
      return res.json({ message: "Forbidden" });
    }

    // must be editable state
    if (![REPORT_STATUS.DRAFT, REPORT_STATUS.NEEDS_CORRECTION].includes(report.status)) {
      res.status(400);
      return res.json({ message: "Report is not editable in current status" });
    }

    const body = normalizeKeyFlags(req.body);

    // Only update allowed fields (manager should never change content)
    const allowed = [
      "project",
      "weekStart",
      "weekEnd",
      "categoryTag",
      "tasksCompleted",
      "tasksPlannedNextWeek",
      "blockers",
      "achievements",
      "hoursBreakdown",
      "notes",
    ];

    allowed.forEach((key) => {
      if (body[key] !== undefined) report[key] = body[key];
    });

    await report.save();

    res.json({ message: "Report updated", report });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reports/:id/submit
 * Member: move Draft/Needs Correction -> Submitted
 * Also creates a snapshot in ReportVersion collection.
 */
const submitReport = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;

    const report = await Report.findById(id).session(session);
    if (!report) {
      await session.abortTransaction();
      res.status(404);
      return res.json({ message: "Report not found" });
    }

    if (String(report.user) !== String(req.user.id)) {
      await session.abortTransaction();
      res.status(403);
      return res.json({ message: "Forbidden" });
    }

    if (![REPORT_STATUS.DRAFT, REPORT_STATUS.NEEDS_CORRECTION].includes(report.status)) {
      await session.abortTransaction();
      res.status(400);
      return res.json({ message: "Only Draft/Needs Correction reports can be submitted" });
    }

    // increment version if resubmitting after correction
    const nextVersion =
      report.status === REPORT_STATUS.NEEDS_CORRECTION
        ? report.currentVersion + 1
        : report.currentVersion;

    // Create snapshot
    await ReportVersion.create(
      [
        {
          report: report._id,
          versionNumber: nextVersion,
          snapshot: {
            project: report.project,
            weekStart: report.weekStart,
            weekEnd: report.weekEnd,
            categoryTag: report.categoryTag,
            tasksCompleted: report.tasksCompleted,
            tasksPlannedNextWeek: report.tasksPlannedNextWeek,
            blockers: report.blockers,
            achievements: report.achievements,
            hoursBreakdown: report.hoursBreakdown,
            notes: report.notes,
          },
          submittedAt: new Date(),
        },
      ],
      { session }
    );

    report.status = REPORT_STATUS.SUBMITTED;
    report.managerComment = "";
    report.lastSubmittedAt = new Date();
    report.currentVersion = nextVersion;

    await report.save({ session });

    await session.commitTransaction();

    res.json({ message: "Report submitted", report });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createReport,
  getMyReports,
  getReportById,
  updateReport,
  submitReport,
};