import { useEffect, useState } from "react";
import {
  FileText,
  Heart,
  FolderOpen,
  Copy,
  ArrowUpRight,
  Eye,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { usePrompts } from "../context/PromptContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recordPromptCopy, prompts } = usePrompts();

  const [stats, setStats] = useState({
    totalPrompts: 0,
    favorites: 0,
    categories: 0,
    promptCopies: 0,
  });

  const [recentPrompts, setRecentPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5001/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStats({
          totalPrompts: data.stats?.totalPrompts || 0,
          favorites: data.stats?.favorites || 0,
          categories: data.stats?.categories || 0,
          promptCopies: data.stats?.promptCopies || 0,
        });

        setRecentPrompts(data.recentPrompts || []);
      }
    } catch (error) {
      console.error("Dashboard data load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [prompts]);

  const handleCopyRecent = async (promptItem) => {
    try {
      const fullPrompt =
        prompts.find(
          (p) => Number(p.id) === Number(promptItem.id)
        )?.prompt ||
        promptItem.description ||
        promptItem.title;

      await navigator.clipboard.writeText(fullPrompt);

      await recordPromptCopy(promptItem.id);

      setRecentPrompts((prev) =>
        prev.map((p) => {
          if (Number(p.id) === Number(promptItem.id)) {
            return {
              ...p,
              usage_count:
                (Number(p.usage_count) || 0) + 1,
            };
          }

          return p;
        })
      );

      setStats((prev) => ({
        ...prev,
        promptCopies:
          Number(prev.promptCopies) + 1,
      }));

      alert("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy prompt.");
    }
  };

  const displayName = user?.name
    ? user.name.split(" ")[0]
    : "there";

  return (
    <div className="dashboard">

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">

          <span className="dashboard-eyebrow">
            AI Prompt Library
          </span>

          <h2>
            Welcome back, {displayName} 👋
          </h2>

          <p>
            Here's what's happening with your
            prompt library today.
          </p>

        </div>

        <button
          className="primary-btn dashboard-add-btn"
          onClick={() => navigate("/add-prompt")}
        >
          <Plus size={18} />
          Add Prompt
        </button>
      </section>

      {/* Statistics */}
      <section className="stats-grid">

        {/* Total Prompts */}
        <div
          className="stat-card stat-card-clickable"
          onClick={() => navigate("/prompts")}
        >
          <div className="stat-icon">
            <FileText size={21} />
          </div>

          <div className="stat-content">
            <span>Total Prompts</span>

            <h3>
              {loading ? "..." : stats.totalPrompts}
            </h3>

            <small>
              In your collection
            </small>
          </div>

          <ArrowUpRight
            size={18}
            className="stat-arrow"
          />
        </div>

        {/* Favorites */}
        <div
          className="stat-card stat-card-clickable"
          onClick={() => navigate("/favorites")}
        >
          <div className="stat-icon">
            <Heart size={21} />
          </div>

          <div className="stat-content">
            <span>Favorites</span>

            <h3>
              {loading ? "..." : stats.favorites}
            </h3>

            <small>
              Saved prompts
            </small>
          </div>

          <ArrowUpRight
            size={18}
            className="stat-arrow"
          />
        </div>

        {/* Categories */}
        <div className="stat-card">
          <div className="stat-icon">
            <FolderOpen size={21} />
          </div>

          <div className="stat-content">
            <span>Categories</span>

            <h3>
              {loading ? "..." : stats.categories}
            </h3>

            <small>
              Active categories
            </small>
          </div>

          <ArrowUpRight
            size={18}
            className="stat-arrow"
          />
        </div>

        {/* Prompt Copies */}
        <div className="stat-card">
          <div className="stat-icon">
            <Copy size={21} />
          </div>

          <div className="stat-content">
            <span>Prompt Copies</span>

            <h3>
              {loading ? "..." : stats.promptCopies}
            </h3>

            <small>
              Total reuse events
            </small>
          </div>

          <ArrowUpRight
            size={18}
            className="stat-arrow"
          />
        </div>

      </section>

      {/* Recent Prompts */}
      <section className="recent-section">

        <div className="section-header">

          <div>
            <span className="section-eyebrow">
              Your Library
            </span>

            <h2>
              Recent Prompts
            </h2>

            <p>
              Your recently added prompts
            </p>
          </div>

          <button
            className="view-all-btn"
            onClick={() => navigate("/prompts")}
          >
            View all
            <ArrowUpRight size={15} />
          </button>

        </div>

        {recentPrompts.length === 0 ? (

          <div className="empty-state dashboard-empty-state">

            <div className="empty-state-icon">
              <FileText size={30} />
            </div>

            <h3>
              No prompts created yet
            </h3>

            <p>
              Start organizing your AI prompts by
              adding your first prompt or generating
              one with AI.
            </p>

            <div className="empty-state-actions">

              <button
                className="primary-btn"
                onClick={() => navigate("/add-prompt")}
              >
                <Plus size={16} />
                Add Prompt
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/ai-assistant")}
              >
                Use AI Assistant
              </button>

            </div>

          </div>

        ) : (

          <div className="recent-grid">

            {recentPrompts.map((item) => {

              const favorite = isFavorite(item.id);

              return (
                <div
                  key={item.id}
                  className="prompt-card"
                >

                  <div className="prompt-card-top">

                    <span className="category-badge">
                      {item.category_name}
                    </span>

                    <button
                      type="button"
                      className={`icon-btn ${
                        favorite
                          ? "favorite-active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleFavorite(item.id)
                      }
                      title={
                        favorite
                          ? "Remove favorite"
                          : "Add favorite"
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

                  <h3
                    className="prompt-card-title-clickable"
                    onClick={() =>
                      navigate(`/prompts/${item.id}`)
                    }
                  >
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                  <div className="prompt-footer">

                    <span>
                      {item.usage_count || 0} copies
                    </span>

                    <div className="prompt-footer-actions">

                      <button
                        type="button"
                        className="view-btn"
                        onClick={() =>
                          navigate(`/prompts/${item.id}`)
                        }
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() =>
                          handleCopyRecent(item)
                        }
                      >
                        <Copy size={14} />
                        Copy
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default Dashboard;