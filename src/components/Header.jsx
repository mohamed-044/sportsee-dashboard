import logo from "../img/logo.png";
import "../style/Header.css";

function Header() {
  return (
    <header className="header">
      <a href="/"><img src={logo} alt="SPORTSEE" className="logo" /></a>

      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/profile">Mon profil</a>
        <span className="logout">Se déconnecter</span>
      </nav>
    </header>
  );
}

export default Header;