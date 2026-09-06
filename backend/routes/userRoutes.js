const express = require("express");
const { body } = require("express-validator");

const {
  listUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

// Admin & Manager
router.get("/", protect, allowRoles(ROLES.ADMIN, ROLES.MANAGER), listUsers);
router.get("/:id", protect, allowRoles(ROLES.ADMIN, ROLES.MANAGER), getUserById);

router.put(
  "/:id/role",
  protect,
  allowRoles(ROLES.ADMIN),
  [body("role").notEmpty().withMessage("role is required")],
  updateUserRole
);

router.patch(
  "/:id/status",
  protect,
  allowRoles(ROLES.ADMIN),
  [body("isActive").isBoolean().withMessage("isActive must be boolean")],
  updateUserStatus
);

module.exports = router;