const db = require("../config/database");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Total prompts
    const [totalPromptsResult] = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM prompts
      WHERE user_id = ?
      `,
      [userId]
    );

    // Total favorites
    const [favoritesResult] = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM favorites
      WHERE user_id = ?
      `,
      [userId]
    );

    // Total categories used
    const [categoriesResult] = await db.execute(
      `
      SELECT COUNT(DISTINCT category_id) AS total
      FROM prompts
      WHERE user_id = ?
      `,
      [userId]
    );

    // Total prompt copies
    const [copiesResult] = await db.execute(
      `
      SELECT COALESCE(SUM(usage_count), 0) AS total
      FROM prompts
      WHERE user_id = ?
      `,
      [userId]
    );

    // Recent prompts
    const [recentPrompts] = await db.execute(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.usage_count,
        c.category_name
      FROM prompts p
      JOIN categories c
        ON p.category_id = c.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT 3
      `,
      [userId]
    );

    res.json({
      stats: {
        totalPrompts: totalPromptsResult[0].total,
        favorites: favoritesResult[0].total,
        categories: categoriesResult[0].total,
        promptCopies: copiesResult[0].total,
      },
      recentPrompts,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);

    res.status(500).json({
      message: "Server error while loading dashboard data.",
    });
  }
};

module.exports = {
  getDashboardData,
};