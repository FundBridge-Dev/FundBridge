import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import AuthForm from "./components/AuthForm/AuthForm.jsx";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.jsx";
import { getCurrentUser, logout } from "./api/authAPI.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
    navigate("/");
  }

  if (checkingSession) {
    return <p className="status-message">Loading…</p>;
  }

  return (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/login"
            element={<AuthForm key="login" mode="login" onAuth={setUser} />}
          />
          <Route
            path="/register"
            element={
              <AuthForm key="register" mode="register" onAuth={setUser} />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
