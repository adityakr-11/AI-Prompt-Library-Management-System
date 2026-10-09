const db = require("../config/database");

const recordPromptCopy = async (req, res) => {
  try {
    const userId = req.user.userId;
    const promptId = req.params.id;

    // Check that the prompt exists
    const [prompts] = await db.execute(
      `
      SELECT id
      FROM prompts
      WHERE id = ?
      `,
      [promptId]
    );

    if (prompts.length === 0) {
      return res.status(404).json({
        message: "Prompt not found.",
      });
    }

    // Increase the prompt's copy count
    await db.execute(
      `
      UPDATE prompts
      SET usage_count = usage_count + 1
      WHERE id = ?
      `,
      [promptId]
    );

    // Record the copy activity for the logged-in user
    await db.execute(
      `
      INSERT INTO prompt_usage
      (user_id, prompt_id, action_type)
      VALUES (?, ?, 'copy')
      `,
      [userId, promptId]
    );

    res.json({
      message: "Prompt copy recorded successfully.",
    });
  } catch (error) {
    console.error("Record copy error:", error);

    res.status(500).json({
      message: "Server error while recording prompt copy.",
    });
  }
};

module.exports = {
  recordPromptCopy,
};