import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import AuthForm from "./components/AuthForm/AuthForm.jsx";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.jsx";
import { getCurrentUser, logout } from "./api/authAPI.js";
import SavedRequests from "./components/SavedRequests/SavedRequests.jsx";
import SponsorshipBoard from "./components/SponsorshipBoard/SponsorshipBoard.jsx";
import SponsorshipDetail from "./components/SponsorshipDetail/SponsorshipDetail.jsx";
import SponsorshipEditor from "./components/SponsorshipEditor/SponsorshipEditor.jsx";
import RequireAuth from "./components/RequireAuth/RequireAuth.jsx";

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

          <Route path="/sponsorships" element={<SponsorshipBoard />} />

          <Route
            path="/sponsorships/:id"
            element={<SponsorshipDetail currentUser={user} />}
          />

          <Route
            path="/sponsorships/new"
            element={
              <RequireAuth user={user}>
                <SponsorshipEditor />
              </RequireAuth>
            }
          />

          <Route
            path="/sponsorships/:id/edit"
            element={
              <RequireAuth user={user}>
                <SponsorshipEditor />
              </RequireAuth>
            }
          />

          <Route
            path="/saved-requests"
            element={
              <RequireAuth user={user}>
                <SavedRequests />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
