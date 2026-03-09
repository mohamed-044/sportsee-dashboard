import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const API_URL = "http://localhost:8000"; // backend
  try {
    // Login
    const loginRes = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!loginRes.ok) {
      const err = await loginRes.json();
      throw new Error(err.message || "Erreur login");
    }

    const loginData = await loginRes.json();
    localStorage.setItem("token", loginData.token);

    // Fetch user-info avec token
    const userRes = await fetch(`${API_URL}/api/user-info`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loginData.token}`
      }
    });

    if (!userRes.ok) {
      const err = await userRes.json();
      throw new Error(err.message || "Erreur user-info");
    }

    const userData = await userRes.json();
    console.log("userData:", userData);

    navigate("/dashboard"); // redirection

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
