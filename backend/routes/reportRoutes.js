const express = require("express");
const { body } = require("express-validator");

const {
  createReport,
  getMyReports,
  getReportById,
  updateReport,
  submitReport,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

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

// View report detail (member own, manager any) - RBAC inside controller
router.get("/:id", protect, getReportById);

// Member update (Draft/Needs Correction)
router.put("/:id", protect, updateReport);

// Member submit
router.put("/:id/submit", protect, submitReport);

module.exports = router;