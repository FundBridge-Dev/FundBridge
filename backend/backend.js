import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";

const PORT = process.env.PORT || 3000;
const distPath = fileURLToPath(new URL("../frontend/dist", import.meta.url));

const app = express();

app.use(express.json());

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile("index.html", { root: distPath });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`FundBridge API running on http://localhost:${PORT}`);
});
