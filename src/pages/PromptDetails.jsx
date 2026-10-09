import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Edit,
  Trash2,
  Heart,
  BarChart2,
} from "lucide-react";

import { usePrompts } from "../context/PromptContext";
import { useFavorites } from "../context/FavoritesContext";

function PromptDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { prompts, deletePrompt, recordPromptCopy } = usePrompts();
  const { isFavorite, toggleFavorite } = useFavorites();

  const prompt = prompts.find(
    (item) => Number(item.id) === Number(id)
  );

  if (!prompt) {
    return (
      <div className="empty-state">
        <h3>Prompt not found</h3>
        <p>The prompt you are looking for does not exist or has been removed.</p>
        <button
          className="primary-btn"
          onClick={() => navigate("/prompts")}
        >
          Back to Library
        </button>
      </div>
    );
  }

  const favorite = isFavorite(prompt.id);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      await recordPromptCopy(prompt.id);
      alert("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy prompt.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${prompt.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const success = await deletePrompt(prompt.id);
    if (success) {
      alert("Prompt deleted successfully!");
      navigate("/prompts");
    }
  };

  return (
    <div className="prompt-details-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          className="back-btn"
          onClick={() => navigate("/prompts")}
        >
          <ArrowLeft size={18} />
          Back to Library
        </button>

        <button
          type="button"
          className={`icon-btn ${favorite ? "favorite-active" : ""}`}
          onClick={() => toggleFavorite(prompt.id)}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "8px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: 500,
            color: favorite ? "#ef4444" : "#4b5563"
          }}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
          {favorite ? "Favorited" : "Favorite"}
        </button>
      </div>

      <div className="prompt-details-card">
        <div className="prompt-details-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span className="library-category">
                {prompt.category}
              </span>

              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#6b7280" }}>
                <BarChart2 size={15} />
                {prompt.usageCount || 0} copies
              </span>
            </div>

            <h2>{prompt.title}</h2>
            <p>{prompt.description}</p>
          </div>
        </div>

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="library-tags" style={{ marginTop: "12px" }}>
            {prompt.tags.map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="library-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="prompt-content-section" style={{ marginTop: "24px" }}>
          <h3>Prompt Content</h3>
          <div className="prompt-content-box" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {prompt.prompt}
          </div>
        </div>

        <div className="prompt-details-actions" style={{ marginTop: "24px" }}>
          <button className="primary-btn copy-btn" onClick={handleCopy}>
            <Copy size={16} />
            Copy Prompt
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate(`/prompts/${prompt.id}/edit`)}
          >
            <Edit size={16} />
            Edit
          </button>

          <button className="delete-btn" onClick={handleDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromptDetails;