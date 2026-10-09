import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { usePrompts } from "../context/PromptContext";

function AddPrompt() {
  const navigate = useNavigate();
  const { addPrompt } = usePrompts();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("Programming");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);

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

      const success = await addPrompt({
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

      alert("Prompt saved successfully!");

      navigate("/prompts");
    } catch (error) {
      console.error("Add prompt error:", error);

      alert("Unable to save prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-prompt-page">

      <div className="add-prompt-header">

        <button
          className="back-btn"
          onClick={() => navigate("/prompts")}
        >
          <ArrowLeft size={18} />
          Back to Library
        </button>

        <div>
          <h2>Add New Prompt</h2>

          <p>
            Create and save a new AI prompt to your library.
          </p>
        </div>

      </div>

      <form
        className="prompt-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>Prompt Title</label>

          <input
            type="text"
            placeholder="e.g. Java Code Generator"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <input
            type="text"
            placeholder="Describe what this prompt does..."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Prompt</label>

          <textarea
            rows="8"
            placeholder="Write your AI prompt here..."
            value={prompt}
            onChange={(event) =>
              setPrompt(event.target.value)
            }
          />
        </div>

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

        <div className="form-group">
          <label>Tags</label>

          <input
            type="text"
            placeholder="Java, Coding, OOP"
            value={tags}
            onChange={(event) =>
              setTags(event.target.value)
            }
          />

          <small>
            Separate multiple tags with commas.
          </small>
        </div>

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/prompts")}
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
              : "Save Prompt"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddPrompt;