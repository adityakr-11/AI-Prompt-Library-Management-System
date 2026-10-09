const express = require("express");

const router = express.Router();

const {
  getPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
} = require("../controllers/promptController");

const { verifyToken } = require("../middleware/authMiddleware");

// ========================================
// GET ALL PROMPTS
// ========================================

router.get(
  "/",
  verifyToken,
  getPrompts
);

// ========================================
// CREATE PROMPT
// ========================================

router.post(
  "/",
  verifyToken,
  createPrompt
);

// ========================================
// UPDATE PROMPT
// ========================================

router.put(
  "/:id",
  verifyToken,
  updatePrompt
);

// ========================================
// DELETE PROMPT
// ========================================

router.delete(
  "/:id",
  verifyToken,
  deletePrompt
);

module.exports = router;