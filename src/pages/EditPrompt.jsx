import { useEffect, useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { usePrompts } from "../context/PromptContext";

function EditPrompt() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    prompts,
    editPrompt,
    loading: promptsLoading,
  } = usePrompts();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("Programming");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingPrompt = prompts.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!existingPrompt) {
      return;
    }

    setTitle(existingPrompt.title || "");
    setDescription(existingPrompt.description || "");
    setPrompt(existingPrompt.prompt || "");
    setCategory(
      existingPrompt.category || "Programming"
    );

    setTags(
      (existingPrompt.tags || []).join(", ")
    );
  }, [prompts, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !prompt.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const success = await editPrompt({
        id: Number(id),
        title: title.trim(),
        description: description.trim(),
        prompt: prompt.trim(),
        category,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      });

      if (!success) {
        return;
      }

      alert("Prompt updated successfully!");

      navigate(`/prompts/${id}`);
    } catch (error) {
      console.error(
        "Edit prompt error:",
        error
      );

      alert("Unable to update prompt.");
    } finally {
      setLoading(false);
    }
  };

  if (promptsLoading) {
    return (
      <div className="empty-state">
        <h3>Loading prompt...</h3>
      </div>
    );
  }

  const promptExists = prompts.some(
    (item) => Number(item.id) === Number(id)
  );

  if (!promptExists) {
    return (
      <div className="empty-state">
        <h3>Prompt not found</h3>

        <button
          className="primary-btn"
          onClick={() => navigate("/prompts")}
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="add-prompt-page">

      <div className="add-prompt-header">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate(`/prompts/${id}`)
          }
        >
          <ArrowLeft size={18} />
          Back to Prompt
        </button>

        <div>
          <h2>Edit Prompt</h2>

          <p>
            Update your prompt and its tags.
          </p>
        </div>

      </div>

      <form
        className="prompt-form"
        onSubmit={handleSubmit}
      >

        {/* Title */}
        <div className="form-group">
          <label>Prompt Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Enter prompt title"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>

          <input
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter prompt description"
          />
        </div>

        {/* Prompt */}
        <div className="form-group">
          <label>Prompt</label>

          <textarea
            rows="9"
            value={prompt}
            onChange={(event) =>
              setPrompt(event.target.value)
            }
            placeholder="Enter your prompt"
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option>Programming</option>
            <option>Web Development</option>
            <option>Database</option>
            <option>Education</option>
            <option>Career</option>
            <option>AI</option>
            <option>Writing</option>
            <option>Other</option>
          </select>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label>Tags</label>

          <input
            type="text"
            value={tags}
            onChange={(event) =>
              setTags(event.target.value)
            }
            placeholder="Java, OOP, Exam"
          />

          <small>
            Separate tags with commas.
          </small>
        </div>

        {/* Actions */}
        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(`/prompts/${id}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn save-btn"
            disabled={loading}
          >
            <Save size={17} />

            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditPrompt;