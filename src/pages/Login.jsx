import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser, fetchUserInfo } from "../services/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = await loginUser(username, password);
      login(loginData.token);

      const userData = await fetchUserInfo(loginData.token);
      console.log("userData:", userData);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Identifiant"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Se connecter</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
