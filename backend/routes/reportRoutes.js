const express = require("express");
const { body } = require("express-validator");

const {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  updateReport,
  submitReport,
  reviewReport,
  getReportVersions,
  restoreReportVersion,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

/**
 * Minimal validation for required fields.
 * (You can increase validation later.)
 */
const reportBaseValidation = [
  body("project").notEmpty().withMessage("project is required"),
  body("weekStart").notEmpty().withMessage("weekStart is required"),
  body("weekEnd").notEmpty().withMessage("weekEnd is required"),
];

// Member create report (Draft)
router.post("/", protect, reportBaseValidation, createReport);

// Member list own reports
router.get("/my", protect, getMyReports);

// Manager / Admin list ALL team reports (must come BEFORE "/:id" below)
router.get("/", protect, allowRoles(ROLES.MANAGER, ROLES.ADMIN), getAllReports);

// Get report versions
router.get("/:id/versions", protect, getReportVersions);

// Restore a report version
router.put("/:id/versions/:versionNumber/restore", protect, restoreReportVersion);

// View report detail (member own, manager any) - RBAC inside controller
router.get("/:id", protect, getReportById);

// Member update (Draft/Needs Correction)
router.put("/:id", protect, updateReport);

// Member submit
router.put("/:id/submit", protect, submitReport);

// Manager / Admin review report
router.put("/:id/review", protect, allowRoles(ROLES.MANAGER, ROLES.ADMIN), reviewReport);

module.exports = router;