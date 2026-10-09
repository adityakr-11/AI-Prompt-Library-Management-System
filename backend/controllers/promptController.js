const db = require("../config/database");

// GET PROMPTS
const getPrompts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [prompts] = await db.execute(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.prompt_text AS prompt,
        p.usage_count,
        p.created_at,
        p.updated_at,
        c.category_name AS category
      FROM prompts p
      JOIN categories c
        ON p.category_id = c.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      `,
      [userId]
    );

    for (const prompt of prompts) {
      const [tags] = await db.execute(
        `
        SELECT t.tag_name
        FROM tags t
        JOIN prompt_tags pt
          ON t.id = pt.tag_id
        WHERE pt.prompt_id = ?
        ORDER BY t.tag_name
        `,
        [prompt.id]
      );

      prompt.tags = tags.map((tag) => tag.tag_name);
    }

    res.json({ prompts });
  } catch (error) {
    console.error("Get prompts error:", error);

    res.status(500).json({
      message: "Server error while fetching prompts.",
    });
  }
};

// CREATE PROMPT
const createPrompt = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.userId;

    const { title, description, prompt, category, tags = [] } = req.body;

    if (!title || !description || !prompt || !category) {
      connection.release();

      return res.status(400).json({
        message: "Title, description, prompt, and category are required.",
      });
    }

    await connection.beginTransaction();

    const cleanCategory = String(category).trim();

    let [categories] = await connection.execute(
      `
      SELECT id
      FROM categories
      WHERE LOWER(TRIM(category_name)) = LOWER(?)
      `,
      [cleanCategory]
    );

    let categoryId;

    if (categories.length === 0) {
      const [insertCat] = await connection.execute(
        `
        INSERT INTO categories (category_name)
        VALUES (?)
        `,
        [cleanCategory]
      );

      categoryId = insertCat.insertId;
    } else {
      categoryId = categories[0].id;
    }

    const [result] = await connection.execute(
      `
      INSERT INTO prompts
      (
        user_id,
        category_id,
        title,
        description,
        prompt_text
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, categoryId, title.trim(), description.trim(), prompt.trim()]
    );

    const promptId = result.insertId;

    for (const tagName of tags) {
      const cleanTag = String(tagName).trim();

      if (!cleanTag) continue;

      await connection.execute(
        `
        INSERT IGNORE INTO tags (tag_name)
        VALUES (?)
        `,
        [cleanTag]
      );

      const [tagRows] = await connection.execute(
        `
        SELECT id
        FROM tags
        WHERE tag_name = ?
        `,
        [cleanTag]
      );

      if (tagRows.length > 0) {
        await connection.execute(
          `
          INSERT IGNORE INTO prompt_tags
          (prompt_id, tag_id)
          VALUES (?, ?)
          `,
          [promptId, tagRows[0].id]
        );
      }
    }

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: "Prompt created successfully.",
      promptId,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();

    console.error("Create prompt error:", error);

    res.status(500).json({
      message: "Server error while creating prompt.",
    });
  }
};

// UPDATE PROMPT
const updatePrompt = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.userId;
    const promptId = req.params.id;

    const { title, description, prompt, category, tags = [] } = req.body;

    if (!title || !description || !prompt || !category) {
      connection.release();

      return res.status(400).json({
        message: "Title, description, prompt, and category are required.",
      });
    }

    await connection.beginTransaction();

    const cleanCategory = String(category).trim();

    let [categories] = await connection.execute(
      `
      SELECT id
      FROM categories
      WHERE LOWER(TRIM(category_name)) = LOWER(?)
      `,
      [cleanCategory]
    );

    let categoryId;

    if (categories.length === 0) {
      const [insertCat] = await connection.execute(
        `
        INSERT INTO categories (category_name)
        VALUES (?)
        `,
        [cleanCategory]
      );

      categoryId = insertCat.insertId;
    } else {
      categoryId = categories[0].id;
    }

    const [result] = await connection.execute(
      `
      UPDATE prompts
      SET
        title = ?,
        description = ?,
        prompt_text = ?,
        category_id = ?,
        updated_at = NOW()
      WHERE id = ? AND user_id = ?
      `,
      [title.trim(), description.trim(), prompt.trim(), categoryId, promptId, userId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();

      return res.status(404).json({
        message: "Prompt not found or access denied.",
      });
    }

    await connection.execute(
      `
      DELETE FROM prompt_tags
      WHERE prompt_id = ?
      `,
      [promptId]
    );

    for (const tagName of tags) {
      const cleanTag = String(tagName).trim();

      if (!cleanTag) continue;

      await connection.execute(
        `
        INSERT IGNORE INTO tags (tag_name)
        VALUES (?)
        `,
        [cleanTag]
      );

      const [tagRows] = await connection.execute(
        `
        SELECT id
        FROM tags
        WHERE tag_name = ?
        `,
        [cleanTag]
      );

      if (tagRows.length > 0) {
        await connection.execute(
          `
          INSERT IGNORE INTO prompt_tags
          (prompt_id, tag_id)
          VALUES (?, ?)
          `,
          [promptId, tagRows[0].id]
        );
      }
    }

    await connection.commit();
    connection.release();

    res.status(200).json({
      message: "Prompt updated successfully.",
      promptId,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();

    console.error("Update prompt error:", error);

    res.status(500).json({
      message: "Server error while updating prompt.",
    });
  }
};

// DELETE PROMPT
const deletePrompt = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.userId;
    const promptId = req.params.id;

    await connection.beginTransaction();

    await connection.execute(
      `
      DELETE FROM prompt_tags
      WHERE prompt_id = ?
      `,
      [promptId]
    );

    const [result] = await connection.execute(
      `
      DELETE FROM prompts
      WHERE id = ? AND user_id = ?
      `,
      [promptId, userId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();

      return res.status(404).json({
        message: "Prompt not found or access denied.",
      });
    }

    await connection.commit();
    connection.release();

    res.status(200).json({
      message: "Prompt deleted successfully.",
      promptId,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();

    console.error("Delete prompt error:", error);

    res.status(500).json({
      message: "Server error while deleting prompt.",
    });
  }
};

module.exports = {
  getPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
};
