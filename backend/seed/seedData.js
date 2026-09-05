const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Project = require("../models/Project");
const Report = require("../models/Report");
const ReportVersion = require("../models/ReportVersion");

const { ROLES, REPORT_STATUS } = require("../utils/constants");

dotenv.config();

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const weekRange = (startDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
};

const seed = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing old data...");
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Report.deleteMany({}),
      ReportVersion.deleteMany({}),
    ]);

    console.log("👤 Creating users...");

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "123456",
      role: ROLES.ADMIN,
    });

    const manager = await User.create({
      name: "Manager One",
      email: "manager@test.com",
      password: "123456",
      role: ROLES.MANAGER,
    });

    const members = await User.insertMany([
      {
        name: "Member A",
        email: "membera@test.com",
        password: "123456",
        role: ROLES.MEMBER,
      },
      {
        name: "Member B",
        email: "memberb@test.com",
        password: "123456",
        role: ROLES.MEMBER,
      },
      {
        name: "Member C",
        email: "memberc@test.com",
        password: "123456",
        role: ROLES.MEMBER,
      },
      {
        name: "Member D",
        email: "memberd@test.com",
        password: "123456",
        role: ROLES.MEMBER,
      },
    ]);

    console.log("📁 Creating projects...");
    const projects = await Project.insertMany([
      { name: "Client A", description: "Client work", color: "#22C55E", members: members.map(m => m._id) },
      { name: "Internal Tooling", description: "Internal product", color: "#3B82F6", members: members.map(m => m._id) },
      { name: "R&D", description: "Research tasks", color: "#A855F7", members: members.map(m => m._id) },
    ]);

    // Weeks
    const w1 = weekRange("2026-08-18");
    const w2 = weekRange("2026-08-25");
    const w3 = weekRange("2026-09-01");

    console.log("📝 Creating reports...");

    // Helper to create a report + versions
    const createReportWithVersion = async ({
      userId,
      projectId,
      weekStart,
      weekEnd,
      status,
      currentVersion,
      managerComment = "",
      reviewHistory = [],
    }) => {
      const baseContent = {
        project: projectId,
        weekStart,
        weekEnd,
        categoryTag: "",
        tasksCompleted: [
          {
            taskName: "Weekly tasks",
            priority: "Medium",
            plannedPercent: 100,
            actualPercent: 90,
            status: "Completed",
            timePlanned: 6,
            timeSpent: 7,
            deliverable: "Work delivered",
          },
        ],
        tasksPlannedNextWeek: ["Continue feature development"],
        blockers: [{ description: "No major blockers", isKeyIssue: true }],
        achievements: [{ description: "Delivered main tasks", isKeyAchievement: true }],
        hoursBreakdown: { development: 10, meetings: 2, testing: 1, documentation: 1, other: 0 },
        notes: "Seeded report",
      };

      const report = await Report.create({
        user: userId,
        project: projectId,
        weekStart,
        weekEnd,
        ...baseContent,
        status,
        managerComment,
        reviewHistory,
        currentVersion,
        lastSubmittedAt: status !== REPORT_STATUS.DRAFT ? daysAgo(3) : null,
        lastReviewedAt:
          status === REPORT_STATUS.APPROVED || status === REPORT_STATUS.NEEDS_CORRECTION
            ? daysAgo(2)
            : null,
      });

      // Create versions only if at least submitted once
      if (status !== REPORT_STATUS.DRAFT) {
        await ReportVersion.create({
          report: report._id,
          versionNumber: currentVersion,
          snapshot: baseContent,
          submittedAt: daysAgo(3),
        });
      }

      return report;
    };

    // Create mixed statuses
    await createReportWithVersion({
      userId: members[0]._id,
      projectId: projects[0]._id,
      weekStart: w1.start,
      weekEnd: w1.end,
      status: REPORT_STATUS.APPROVED,
      currentVersion: 1,
      reviewHistory: [
        { action: "APPROVE", comment: "Approved", reviewedBy: manager._id, version: 1 },
      ],
    });

    await createReportWithVersion({
      userId: members[1]._id,
      projectId: projects[1]._id,
      weekStart: w1.start,
      weekEnd: w1.end,
      status: REPORT_STATUS.NEEDS_CORRECTION,
      currentVersion: 1,
      managerComment: "Please add more details about blockers.",
      reviewHistory: [
        {
          action: "REQUEST_CHANGES",
          comment: "Please add more details about blockers.",
          reviewedBy: manager._id,
          version: 1,
        },
      ],
    });

    await createReportWithVersion({
      userId: members[2]._id,
      projectId: projects[2]._id,
      weekStart: w2.start,
      weekEnd: w2.end,
      status: REPORT_STATUS.SUBMITTED,
      currentVersion: 1,
    });

    await Report.create({
      user: members[3]._id,
      project: projects[1]._id,
      weekStart: w3.start,
      weekEnd: w3.end,
      categoryTag: "Internal",
      tasksCompleted: [],
      tasksPlannedNextWeek: [],
      blockers: [],
      achievements: [],
      hoursBreakdown: { development: 0, meetings: 0, testing: 0, documentation: 0, other: 0 },
      notes: "",
      status: REPORT_STATUS.DRAFT,
      currentVersion: 1,
    });

    console.log("✅ Seed completed!");
    console.log("Login accounts:");
    console.log("Admin   : admin@test.com / 123456");
    console.log("Manager : manager@test.com / 123456");
    console.log("Members : membera@test.com ... memberd@test.com / 123456");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();