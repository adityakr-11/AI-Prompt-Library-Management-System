const express = require("express");

const {
  recordPromptCopy,
} = require("../controllers/usageController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/copy",
  verifyToken,
  recordPromptCopy
);

module.exports = router;