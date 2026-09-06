const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/summary", protect, allowRoles(ROLES.MANAGER, ROLES.ADMIN), getDashboardSummary);

module.exports = router;