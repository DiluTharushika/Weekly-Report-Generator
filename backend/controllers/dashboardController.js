const Report = require("../models/Report");
const { REPORT_STATUS } = require("../utils/constants");

const getWeekRange = (weekStartStr) => {
  const start = new Date(weekStartStr);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// GET /api/dashboard/summary?weekStart=YYYY-MM-DD
const getSummary = async (req, res, next) => {
  try {
    const { weekStart } = req.query;
    if (!weekStart) {
      res.status(400);
      return res.json({ message: "weekStart query param is required (YYYY-MM-DD)" });
    }

    const { start, end } = getWeekRange(weekStart);

    // Get all reports for that week
    const reports = await Report.find({
      weekStart: { $gte: start, $lte: end },
    })
      .populate("user", "name email role")
      .populate("project", "name color")
      .lean();

    const total = reports.length;

    const statusCounts = reports.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      {}
    );

    const submittedCount = statusCounts[REPORT_STATUS.SUBMITTED] || 0;
    const approvedCount = statusCounts[REPORT_STATUS.APPROVED] || 0;
    const needsCorrectionCount = statusCounts[REPORT_STATUS.NEEDS_CORRECTION] || 0;
    const draftCount = statusCounts[REPORT_STATUS.DRAFT] || 0;

    // Compliance rate (simple): submitted+approved+needsCorrection vs all reports (for that week)
    const doneOrInReview = submittedCount + approvedCount + needsCorrectionCount;
    const complianceRate = total === 0 ? 0 : Math.round((doneOrInReview / total) * 100);

    // Open blockers count (all blockers entries across team)
    const openBlockersCount = reports.reduce((acc, r) => {
      const blockers = Array.isArray(r.blockers) ? r.blockers : [];
      return acc + blockers.length;
    }, 0);

    // Status by member (for bar chart)
    const statusByMember = {};
    for (const r of reports) {
      const name = r.user?.name || "Unknown";
      if (!statusByMember[name]) {
        statusByMember[name] = {
          Draft: 0,
          Submitted: 0,
          "Needs Correction": 0,
          Approved: 0,
        };
      }
      statusByMember[name][r.status] = (statusByMember[name][r.status] || 0) + 1;
    }

    res.json({
      weekStart: start,
      weekEnd: end,
      totalReports: total,
      submittedCount,
      approvedCount,
      needsCorrectionCount,
      draftCount,
      complianceRate,
      openBlockersCount,
      statusByMember,
      // for recent activity feed in UI
      recentReports: reports
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 10)
        .map((r) => ({
          id: r._id,
          memberName: r.user?.name,
          projectName: r.project?.name,
          status: r.status,
          updatedAt: r.updatedAt,
        })),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary };