import {
  Heart,
  Copy,
  Eye,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { usePrompts } from "../../context/PromptContext";

function PromptCard({
  id,
  title,
  description,
  prompt,
  category,
  tags = [],
  usageCount = 0,
}) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { recordPromptCopy } = usePrompts();

  const favorite = isFavorite(id);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      await recordPromptCopy(id);
      alert("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy prompt.");
    }
  };

  return (
    <div className="library-prompt-card">
      {/* Top */}
      <div className="library-card-top">
        <span className="library-category">
          {category}
        </span>

        <button
          type="button"
          className={`icon-btn ${
            favorite ? "favorite-active" : ""
          }`}
          onClick={() => toggleFavorite(id)}
          title={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            size={18}
            fill={
              favorite
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      {/* Title */}
      <h3
        onClick={() => navigate(`/prompts/${id}`)}
        style={{ cursor: "pointer" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="library-description">
        {description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="prompt-tags">
          {tags.map((tag, index) => (
            <span
              className="prompt-tag"
              key={`${tag}-${index}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom */}
      <div className="library-card-bottom">
        <span className="usage-count" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <BarChart2 size={13} />
          {usageCount || 0} {usageCount === 1 ? "copy" : "copies"}
        </span>

        <div className="card-buttons">
          <button
            type="button"
            className="view-btn"
            onClick={() =>
              navigate(`/prompts/${id}`)
            }
          >
            <Eye size={15} />
            View
          </button>

          <button
            type="button"
            className="copy-btn"
            onClick={handleCopy}
          >
            <Copy size={15} />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromptCard;