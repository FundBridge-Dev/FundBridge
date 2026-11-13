import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.jsx";

export default function App() {
  return (
    <>
      <NavBar user={null} onLogout={() => {}} />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
