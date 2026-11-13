import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm.jsx";
import { getCurrentUser } from "./api/authAPI.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <p className="status-message">Loading…</p>;
  }

  return (
    <main className="page">
      {user && <p>Logged in as {user.username}</p>}
      <Routes>
        <Route path="/" element={<h1>FundBridge</h1>} />
        <Route
          path="/login"
          element={<AuthForm key="login" mode="login" onAuth={setUser} />}
        />
        <Route
          path="/register"
          element={<AuthForm key="register" mode="register" onAuth={setUser} />}
        />
      </Routes>
    </main>
  );
}
