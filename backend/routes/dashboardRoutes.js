const express = require("express");
const { getSummary } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

// admin/manager only
router.get("/summary", protect, allowRoles(ROLES.MANAGER, ROLES.ADMIN), getSummary);

module.exports = router;