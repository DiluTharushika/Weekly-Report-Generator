const express = require("express");
const { body } = require("express-validator");

const {
  listUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  createUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

// Admin & Manager
router.get("/", protect, allowRoles(ROLES.ADMIN, ROLES.MANAGER), listUsers);
router.post("/", protect, allowRoles(ROLES.ADMIN, ROLES.MANAGER), createUser);
router.get("/:id", protect, allowRoles(ROLES.ADMIN, ROLES.MANAGER), getUserById);

router.put(
  "/:id/role",
  protect,
  allowRoles(ROLES.ADMIN, ROLES.MANAGER),
  [body("role").notEmpty().withMessage("role is required")],
  updateUserRole
);

router.patch(
  "/:id/status",
  protect,
  allowRoles(ROLES.ADMIN, ROLES.MANAGER),
  [body("isActive").isBoolean().withMessage("isActive must be boolean")],
  updateUserStatus
);

module.exports = router;