import logo from "../img/logo.png";

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="logo" className="logo" />

      <nav>
        <span>Dashboard</span>
        <span>Mon profil</span>
        <span className="logout">Se déconnecter</span>
      </nav>
    </header>
  );
}

export default Header;