import { useState } from "react";
import {
  Sparkles,
  Copy,
  Wand2,
  Save,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { usePrompts } from "../context/PromptContext";

function AIAssistant() {
  const navigate = useNavigate();

  const { addPrompt } = usePrompts();

  const [request, setRequest] = useState("");
  const [type, setType] = useState("Generate");
  const [result, setResult] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("AI");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!request.trim()) {
      alert(
        "Please describe what you want the AI prompt to do."
      );
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/ai/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            request: request.trim(),
            type,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to generate prompt."
        );
        return;
      }

      setResult(data.result || "");

      setTitle(
        request
          .trim()
          .slice(0, 60)
      );
    } catch (error) {
      console.error(
        "AI generation error:",
        error
      );

      alert(
        "Unable to connect to the AI backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result);

      alert("Generated prompt copied!");
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );

      alert("Unable to copy prompt.");
    }
  };

  const handleSave = async () => {
    if (!result.trim()) {
      alert("Generate a prompt first.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a prompt title.");
      return;
    }

    try {
      setSaving(true);

      const success = await addPrompt({
        title: title.trim(),
        description:
          "AI-generated prompt created with AI Assistant.",
        prompt: result.trim(),
        category,
        tags: ["AI", type],
      });

      if (!success) {
        return;
      }

      alert(
        "Prompt saved to your Prompt Library!"
      );

      navigate("/prompts");
    } catch (error) {
      console.error(
        "Save prompt error:",
        error
      );

      alert(
        "Unable to save prompt."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ai-assistant-page">

      {/* Header */}
      <div className="ai-assistant-header">

        <div className="ai-assistant-title">

          <div className="ai-assistant-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <h2>AI Assistant</h2>

            <p>
              Generate, improve, rewrite and save
              your AI prompts.
            </p>
          </div>

        </div>

      </div>

      {/* Prompt Builder */}
      <div className="ai-assistant-card">

        <div className="ai-section-heading">

          <Wand2 size={18} />

          <div>
            <h3>Prompt Builder</h3>

            <p>
              Describe what you want your prompt
              to accomplish.
            </p>
          </div>

        </div>

        {/* Request */}
        <div className="ai-form-group">

          <label>Your Request</label>

          <textarea
            rows="8"
            placeholder="Example: Create a prompt that helps me solve Java programming problems with simple explanations."
            value={request}
            onChange={(event) =>
              setRequest(event.target.value)
            }
          />

        </div>

        {/* Options */}
        <div className="ai-form-row">

          <div className="ai-form-group">

            <label>Action</label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option>Generate</option>
              <option>Improve</option>
              <option>Rewrite</option>
            </select>

          </div>

          <div className="ai-form-group">

            <label>Category</label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option>AI</option>
              <option>Programming</option>
              <option>Web Development</option>
              <option>Database</option>
              <option>Education</option>
              <option>Career</option>
              <option>Writing</option>
              <option>Other</option>
            </select>

          </div>

          <div className="ai-form-actions">

            <button
              type="button"
              className="primary-btn"
              onClick={handleGenerate}
              disabled={loading}
            >
              <Sparkles size={16} />

              {loading
                ? "Generating..."
                : `${type} Prompt`}
            </button>

          </div>

        </div>

      </div>

      {/* Result */}
      {result && (
        <div className="ai-result-card">

          <div className="ai-result-header">

            <div>
              <h3>
                Generated Prompt
              </h3>

              <p>
                Review the prompt before
                saving it to your library.
              </p>
            </div>

            <button
              type="button"
              className="copy-btn"
              onClick={handleCopy}
            >
              <Copy size={15} />
              Copy
            </button>

          </div>

          {/* Title */}
          <div className="ai-form-group">

            <label>
              Prompt Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Enter a title"
            />

          </div>

          {/* Result */}
          <div className="ai-result-box">
            {result}
          </div>

          {/* Save */}
          <div
            className="ai-form-actions"
            style={{
              marginTop: "18px",
            }}
          >
            <button
              type="button"
              className="primary-btn"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : "Save to Prompt Library"}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default AIAssistant;