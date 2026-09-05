const ROLES = Object.freeze({
  MEMBER: "member",
  MANAGER: "manager",
  ADMIN: "admin",
});

const REPORT_STATUS = Object.freeze({
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  NEEDS_CORRECTION: "Needs Correction",
  APPROVED: "Approved",
});

const TASK_PRIORITY = Object.freeze({
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
});

const TASK_STATUS = Object.freeze({
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
});

module.exports = {
  ROLES,
  REPORT_STATUS,
  TASK_PRIORITY,
  TASK_STATUS,
};