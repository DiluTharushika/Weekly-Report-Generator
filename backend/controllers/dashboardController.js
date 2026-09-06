const Report = require("../models/Report");
const User = require("../models/User");
const { REPORT_STATUS, ROLES } = require("../utils/constants");

/**
 * GET /api/dashboard/summary
 * Optional query: weekStart=YYYY-MM-DD
 *   - If provided: stats scoped to that single week (legacy behavior)
 *   - If omitted: stats across ALL reports, all time (default now)
 *
 * Manager/Admin: aggregated counts + recent reports
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const { weekStart } = req.query;

    let filter = {};

    if (weekStart) {
      const start = new Date(weekStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter = { weekStart: { $gte: start, $lt: end } };
    }

    const [
      totalReports,
      submittedCount,
      needsCorrectionCount,
      approvedCount,
      draftCount,
      totalMembers,
      statusByMemberRaw,
      recentReportsRaw,
    ] = await Promise.all([
      Report.countDocuments(filter),
      Report.countDocuments({ ...filter, status: REPORT_STATUS.SUBMITTED }),
      Report.countDocuments({ ...filter, status: REPORT_STATUS.NEEDS_CORRECTION }),
      Report.countDocuments({ ...filter, status: REPORT_STATUS.APPROVED }),
      Report.countDocuments({ ...filter, status: REPORT_STATUS.DRAFT }),
      User.countDocuments({ role: ROLES.MEMBER }),
      Report.find(filter).populate("user", "name").lean(),
      Report.find(filter)
        .sort({ updatedAt: -1 })
        .limit(10)
        .populate("user", "name")
        .populate("project", "name")
        .lean(),
    ]);

    const compliedCount = submittedCount + needsCorrectionCount + approvedCount;
    const complianceRate =
      totalMembers > 0
        ? Math.min(100, Math.round((compliedCount / Math.max(1, totalMembers)) * 100))
        : 0;

    // Open blockers count & hours breakdown aggregation across reports
    let openBlockersCount = 0;
    const hoursBreakdown = { development: 0, testing: 0, meetings: 0, documentation: 0, other: 0 };
    const projectDistributionMap = {};
    let totalTasksCompletedCount = 0;

    statusByMemberRaw.forEach((r) => {
      // Blockers
      if (Array.isArray(r.blockers)) {
        openBlockersCount += r.blockers.length;
      }
      // Hours
      if (r.hoursBreakdown) {
        hoursBreakdown.development += r.hoursBreakdown.development || 0;
        hoursBreakdown.testing += r.hoursBreakdown.testing || 0;
        hoursBreakdown.meetings += r.hoursBreakdown.meetings || 0;
        hoursBreakdown.documentation += r.hoursBreakdown.documentation || 0;
        hoursBreakdown.other += r.hoursBreakdown.other || 0;
      }
      // Tasks completed count
      if (Array.isArray(r.tasksCompleted)) {
        totalTasksCompletedCount += r.tasksCompleted.length;
      }
    });

    recentReportsRaw.forEach((r) => {
      const pName = r.project?.name || "General";
      projectDistributionMap[pName] = (projectDistributionMap[pName] || 0) + 1;
    });

    const projectDistribution = Object.entries(projectDistributionMap).map(([name, value]) => ({
      name,
      value,
    }));

    const statusByMemberMap = {};
    statusByMemberRaw.forEach((r) => {
      const name = r.user?.name || "Unknown";
      if (!statusByMemberMap[name]) {
        statusByMemberMap[name] = {
          name,
          Draft: 0,
          Submitted: 0,
          "Needs Correction": 0,
          Approved: 0,
        };
      }
      statusByMemberMap[name][r.status] =
        (statusByMemberMap[name][r.status] || 0) + 1;
    });
    const statusByMember = Object.values(statusByMemberMap);

    const recentReports = recentReportsRaw.map((r) => ({
      id: r._id,
      memberName: r.user?.name || "Unknown",
      projectName: r.project?.name || "-",
      status: r.status,
      updatedAt: r.updatedAt,
    }));

    res.json({
      totalReports,
      submittedCount,
      needsCorrectionCount,
      approvedCount,
      draftCount,
      complianceRate,
      openBlockersCount,
      hoursBreakdown,
      projectDistribution,
      totalTasksCompletedCount,
      statusByMember,
      recentReports,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardSummary };