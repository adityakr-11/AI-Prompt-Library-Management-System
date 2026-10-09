import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const location = useLocation();
  const { user } = useAuth();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === "/") {
      return {
        title: "Dashboard",
        subtitle: "Overview of your prompt collection and activity",
      };
    }
    if (path === "/prompts") {
      return {
        title: "Prompt Library",
        subtitle: "Search, organize, and manage your AI prompts",
      };
    }
    if (path === "/favorites") {
      return {
        title: "Favorites",
        subtitle: "Your curated and most important prompts",
      };
    }
    if (path === "/add-prompt") {
      return {
        title: "Add Prompt",
        subtitle: "Create and store a new prompt in your library",
      };
    }
    if (path === "/ai-assistant") {
      return {
        title: "AI Assistant",
        subtitle: "Generate, improve, and rewrite prompts with AI",
      };
    }
    if (path.includes("/edit")) {
      return {
        title: "Edit Prompt",
        subtitle: "Update prompt details and tags",
      };
    }
    if (path.startsWith("/prompts/")) {
      return {
        title: "Prompt Details",
        subtitle: "View prompt instructions and usage statistics",
      };
    }
    return {
      title: "Prompt Library",
      subtitle: "Manage and organize your AI prompts",
    };
  };

  const { title, subtitle } = getPageInfo();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="header">
      <div className="header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-right">
        <button
          className="notification-btn"
          title="Notifications"
          onClick={() => alert("All systems operational.")}
        >
          <Bell size={19} />
        </button>

        <div className="header-avatar" title={user?.name || "User"}>
          {initial}
        </div>
      </div>
    </header>
  );
}

export default Header;