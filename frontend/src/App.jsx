import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <main className="page">
      <Routes>
        <Route path="/" element={<h1>FundBridge</h1>} />
      </Routes>
    </main>
  );
}
