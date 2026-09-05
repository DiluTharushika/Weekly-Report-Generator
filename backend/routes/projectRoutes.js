const express = require("express");
const { body } = require("express-validator");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

// Everyone logged in can view
router.get("/", protect, getProjects);

// Manager/Admin can create
router.post(
  "/",
  protect,
  allowRoles(ROLES.MANAGER, ROLES.ADMIN),
  [body("name").trim().notEmpty().withMessage("Project name is required")],
  createProject
);

// Manager/Admin can update
router.put(
  "/:id",
  protect,
  allowRoles(ROLES.MANAGER, ROLES.ADMIN),
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("color").optional().isString(),
    body("members").optional().isArray(),
    body("isActive").optional().isBoolean(),
  ],
  updateProject
);

// Manager/Admin can delete
router.delete(
  "/:id",
  protect,
  allowRoles(ROLES.MANAGER, ROLES.ADMIN),
  deleteProject
);

module.exports = router;