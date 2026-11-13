import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, register } from "../../api/authAPI.js";
import "./AuthForm.css";

const TEXT = {
  login: {
    title: "Log in",
    button: "Log in",
    switchText: "New to FundBridge?",
    switchTo: "/register",
    switchLabel: "Create an account",
  },
  register: {
    title: "Create an account",
    button: "Sign up",
    switchText: "Already have an account?",
    switchTo: "/login",
    switchLabel: "Log in",
  },
};

export default function AuthForm({ mode, onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const text = TEXT[mode];
  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const action = isRegister ? register : login;
      const user = await action(username, password);
      onAuth(user);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-form" aria-labelledby="auth-form-title">
      <h1 id="auth-form-title">{text.title}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="auth-username">Username</label>
        <input
          id="auth-username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          minLength={3}
          maxLength={30}
        />

        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={isRegister ? 8 : undefined}
        />
        {isRegister && (
          <p className="auth-form__hint">At least 8 characters.</p>
        )}

        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait…" : text.button}
        </button>
      </form>

      <p className="auth-form__switch">
        {text.switchText}{" "}
        <Link to={text.switchTo} state={location.state}>
          {text.switchLabel}
        </Link>
      </p>
    </section>
  );
}

AuthForm.propTypes = {
  mode: PropTypes.oneOf(["login", "register"]).isRequired,
  onAuth: PropTypes.func.isRequired,
};
