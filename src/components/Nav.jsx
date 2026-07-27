import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="topnav">
      <div className="topnav-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">PC</span>
          Points&nbsp;Check
        </NavLink>
        <nav className="nav-tabs">
          {auth ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => "nav-tab" + (isActive ? " active" : "")}>
                Profile
              </NavLink>
              <NavLink to="/assessment" className={({ isActive }) => "nav-tab" + (isActive ? " active" : "")}>
                Assessment
              </NavLink>
              <NavLink to="/resume" className={({ isActive }) => "nav-tab" + (isActive ? " active" : "")}>
                Resume
              </NavLink>
              <button className="nav-tab nav-tab-btn" onClick={handleLogout}>
                Sign out ({auth.username})
              </button>
            </>
          ) : (
            <NavLink to="/auth" className={({ isActive }) => "nav-tab" + (isActive ? " active" : "")}>
              Sign in
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  );
}
