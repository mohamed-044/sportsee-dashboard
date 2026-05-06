import "../style/Footer.css";
import logo2 from "../img/logo2.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© Sportsee Tous droits réservés</p>

        <div className="footer-links">
          <span>Conditions générales</span>
          <span>Contact</span>
          <img src={logo2} alt="logo" className="footer-logo" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;