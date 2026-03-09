import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">Blog Admin</span>
      <div className="navbar-links">
        <NavLink to="/posts">Posts</NavLink>
        <NavLink to="/comments">Comments</NavLink>
        <NavLink to="/users">Users</NavLink>
      </div>
      <div className="navbar-user">
        <span>{user?.email}</span>
        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
          {theme === "light" ? "☾" : "☀"}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
