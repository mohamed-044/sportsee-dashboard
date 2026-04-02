function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
  handleSubmit,
  loading,
  error
}) {
  return (
    <div className="login-card">
      <h2>Transformez vos stats en résultats</h2>

      <p className="connect">Se connecter</p>

      <form onSubmit={handleSubmit}>
        <label>Adresse email</label>
        <input
          type="text"
          placeholder="exemple@email.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Mot de passe</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="forgot">Mot de passe oublié ?</p>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LoginForm;