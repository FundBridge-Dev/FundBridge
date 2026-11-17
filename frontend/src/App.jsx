import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import AuthForm from "./components/AuthForm/AuthForm.jsx";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.jsx";
import { getCurrentUser, logout } from "./api/authAPI.js";
import OpportunityBoard from "./components/OpportunityBoard/OpportunityBoard.jsx";
import OpportunityDetail from "./components/OpportunityDetail/OpportunityDetail.jsx";
import RequireAuth from "./components/RequireAuth/RequireAuth.jsx";
import OpportunityForm from "./components/OpportunityForm/OpportunityForm.jsx";

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
          <Route
            path="/opportunities"
            element={<OpportunityBoard user={user} />}
          />
          <Route
            path="/opportunities/:id"
            element={<OpportunityDetail user={user} />}
          />
          <Route
            path="/opportunities/new"
            element={
              <RequireAuth user={user}>
                <OpportunityForm key="create" mode="create" />
              </RequireAuth>
            }
          />
          <Route
            path="/opportunities/:id/edit"
            element={
              <RequireAuth user={user}>
                <OpportunityForm key="edit" mode="edit" />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
