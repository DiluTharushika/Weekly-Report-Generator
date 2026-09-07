const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");
const { chatWithReports } = require("../controllers/chatController");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles(ROLES.MANAGER, ROLES.ADMIN),
  chatWithReports
);

module.exports = router;