import logo from "../img/logo.png";
import "../style/Header.css";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        <a href="/">
          <img src={logo} alt="SPORTSEE" className="logo" />
        </a>

        <nav>
          <a href="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            Dashboard
          </a>
          <a href="/profile" className={location.pathname === "/profile" ? "active" : ""}>
            Mon profil
          </a>
          <span className="logout" onClick={handleLogout}>
            Se déconnecter
          </span>
        </nav>
      </div>
    </header>
  );
}

export default Header;