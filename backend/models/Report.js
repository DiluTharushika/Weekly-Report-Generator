const mongoose = require("mongoose");
const {
  REPORT_STATUS,
  TASK_PRIORITY,
  TASK_STATUS,
} = require("../utils/constants");

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true, trim: true, maxlength: 200 },
    priority: {
      type: String,
      enum: [TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH],
      default: TASK_PRIORITY.MEDIUM,
    },
    plannedPercent: { type: Number, min: 0, max: 100, default: 0 },
    actualPercent: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: [
        TASK_STATUS.NOT_STARTED,
        TASK_STATUS.IN_PROGRESS,
        TASK_STATUS.COMPLETED,
        TASK_STATUS.BLOCKED,
      ],
      default: TASK_STATUS.NOT_STARTED,
    },
    timePlanned: { type: Number, min: 0, default: 0 },
    timeSpent: { type: Number, min: 0, default: 0 },
    deliverable: { type: String, default: "", maxlength: 400 },
  },
  { _id: false }
);

const blockerSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 400 },
    isKeyIssue: { type: Boolean, default: false },
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 400 },
    isKeyAchievement: { type: Boolean, default: false },
  },
  { _id: false }
);

const hoursBreakdownSchema = new mongoose.Schema(
  {
    development: { type: Number, min: 0, default: 0 },
    testing: { type: Number, min: 0, default: 0 },
    meetings: { type: Number, min: 0, default: 0 },
    documentation: { type: Number, min: 0, default: 0 },
    other: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const reviewHistorySchema = new mongoose.Schema(
  {
    comment: { type: String, required: true, trim: true, maxlength: 800 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    action: {
      type: String,
      enum: ["REQUEST_CHANGES", "APPROVE"],
      required: true,
    },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },

    categoryTag: { type: String, default: "", trim: true, maxlength: 80 },

    tasksCompleted: { type: [taskSchema], default: [] },
    tasksPlannedNextWeek: { type: [String], default: [] },

    blockers: { type: [blockerSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },

    hoursBreakdown: { type: hoursBreakdownSchema, default: () => ({}) },

    notes: { type: String, default: "", maxlength: 2000 },

    status: {
      type: String,
      enum: [
        REPORT_STATUS.DRAFT,
        REPORT_STATUS.SUBMITTED,
        REPORT_STATUS.NEEDS_CORRECTION,
        REPORT_STATUS.APPROVED,
      ],
      default: REPORT_STATUS.DRAFT,
    },

    managerComment: { type: String, default: "", maxlength: 800 },
    reviewHistory: { type: [reviewHistorySchema], default: [] },

    currentVersion: { type: Number, default: 1 },
    lastSubmittedAt: { type: Date },
    lastReviewedAt: { type: Date },
  },
  { timestamps: true }
);

reportSchema.index({ user: 1, weekStart: 1 }, { unique: true });

// ✅ Safe export (prevents OverwriteModelError)
module.exports = mongoose.models.Report || mongoose.model("Report", reportSchema);