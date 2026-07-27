import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        await signup(username, password);
        setNotice("Account created. Sign in below to continue.");
        setMode("login");
      } else {
        await login(username, password);
        navigate("/profile");
      }
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : mode === "signup"
          ? "Could not create the account. That username may already be taken."
          : "Invalid username or password."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <p className="eyebrow">Account</p>
      <h1 className="title">{mode === "login" ? "Sign in" : "Create an account"}</h1>
      <p className="lede">
        {mode === "login"
          ? "Use the credentials you registered with to continue your assessment."
          : "Pick a username and password — you'll use these to sign in every time."}
      </p>

      <div className="doc-card" style={{ maxWidth: 440 }}>
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => { setMode("login"); setError(null); setNotice(null); }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => { setMode("signup"); setError(null); setNotice(null); }}
          >
            Create account
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {notice && <div className="alert alert-success">{notice}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field full">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ali.khan"
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? (
              <span className="loader"><span /><span /><span /></span>
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
