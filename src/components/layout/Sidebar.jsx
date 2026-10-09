import {
  LayoutDashboard,
  Library,
  Heart,
  Plus,
  Sparkles,
  LogOut,
} from "lucide-react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const fullName = user?.name || "Guest User";
  const emailOrRole = user?.email || "User";

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* Logo */}
        <div className="logo-section" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="logo-icon">
            AI
          </div>

          <div>
            <h2>AI</h2>
            <span>Prompt Library</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="nav-section">
          <p className="nav-title">MAIN</p>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/prompts"
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Library size={19} />
            <span>Prompt Library</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Heart size={19} />
            <span>Favorites</span>
          </NavLink>
        </div>

        {/* Create */}
        <div className="nav-section">
          <p className="nav-title">CREATE</p>

          <NavLink
            to="/add-prompt"
            className={({ isActive }) =>
              isActive
                ? "nav-item add-prompt active"
                : "nav-item add-prompt"
            }
          >
            <Plus size={19} />
            <span>Add Prompt</span>
          </NavLink>
        </div>

        {/* AI Tools */}
        <div className="nav-section">
          <p className="nav-title">AI TOOLS</p>

          <NavLink
            to="/ai-assistant"
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Sparkles size={19} />
            <span>AI Assistant</span>
          </NavLink>
        </div>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="user-avatar">
          {initial}
        </div>

        <div className="user-info">
          <strong>{fullName}</strong>
          <span title={emailOrRole}>{emailOrRole}</span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;