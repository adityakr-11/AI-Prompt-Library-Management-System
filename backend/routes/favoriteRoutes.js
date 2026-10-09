const express = require("express");

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  verifyToken,
  getFavorites
);

router.post(
  "/:promptId",
  verifyToken,
  addFavorite
);

router.delete(
  "/:promptId",
  verifyToken,
  removeFavorite
);

module.exports = router;