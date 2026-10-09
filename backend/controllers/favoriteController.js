const db = require("../config/database");

// ========================================
// GET FAVORITES
// ========================================

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [favorites] = await db.execute(
      `
      SELECT prompt_id
      FROM favorites
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      favorites: favorites.map(
        (item) => item.prompt_id
      ),
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      message:
        "Server error while fetching favorites.",
    });
  }
};


// ========================================
// ADD FAVORITE
// ========================================

const addFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const promptId = req.params.promptId;

    // Check that the prompt belongs to the logged-in user
    const [prompts] = await db.execute(
      `
      SELECT id
      FROM prompts
      WHERE id = ?
        AND user_id = ?
      `,
      [promptId, userId]
    );

    if (prompts.length === 0) {
      return res.status(404).json({
        message: "Prompt not found.",
      });
    }

    await db.execute(
      `
      INSERT IGNORE INTO favorites
      (user_id, prompt_id)
      VALUES (?, ?)
      `,
      [userId, promptId]
    );

    res.status(201).json({
      message: "Prompt added to favorites.",
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    res.status(500).json({
      message:
        "Server error while adding favorite.",
    });
  }
};


// ========================================
// REMOVE FAVORITE
// ========================================

const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const promptId = req.params.promptId;

    await db.execute(
      `
      DELETE FROM favorites
      WHERE user_id = ?
        AND prompt_id = ?
      `,
      [userId, promptId]
    );

    res.json({
      message: "Prompt removed from favorites.",
    });
  } catch (error) {
    console.error(
      "Remove favorite error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while removing favorite.",
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};