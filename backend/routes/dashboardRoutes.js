const express = require("express");

const {
  getDashboardData,
} = require("../controllers/dashboardController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  verifyToken,
  getDashboardData
);

module.exports = router;