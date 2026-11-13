import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { fileURLToPath } from "node:url";
import { connectDB, getClient } from "./db/myMongoDB.js";
import { createUserIndexes } from "./db/usersDB.js";
import passport from "./auth/passport.js";
import authRouter from "./routes/auth.js";

const PORT = process.env.PORT || 3000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const distPath = fileURLToPath(new URL("../frontend/dist", import.meta.url));

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set. Copy .env.example to .env.");
}

await connectDB();
await createUserIndexes();

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: getClient(),
      dbName: process.env.DB_NAME || "fundbridge",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SEVEN_DAYS_MS,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);

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
