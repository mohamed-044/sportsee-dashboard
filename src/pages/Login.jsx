import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser, fetchUserInfo } from "../services/authService";
import logo from "../img/logo.png";
import "../style/Login.css";
import LoginForm from "../components/LoginForm";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginData = await loginUser(username, password);
      login(loginData.token);

      await fetchUserInfo(loginData.token);

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
    
      <div className="login-left">
        <img src={logo} alt="SPORTSEE" className="logo" />
        <div className="login-container">
         <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
        </div>
        

      <div className="login-right"></div>

    </div>
  );
}

export default Login;