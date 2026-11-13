import { Router } from "express";
import bcrypt from "bcryptjs";
import passport from "../auth/passport.js";
import { createUser, findUserByUsername } from "../db/usersDB.js";

const router = Router();
const USERNAME_PATTERN = /^[a-z0-9._-]{3,30}$/;
const MIN_PASSWORD_LENGTH = 8;

function toPublicUser(user) {
  return { id: user._id.toString(), username: user.username };
}

function logIn(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (error) => (error ? reject(error) : resolve()));
  });
}

router.post("/register", async (req, res) => {
  const username =
    typeof req.body?.username === "string"
      ? req.body.username.trim().toLowerCase()
      : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!USERNAME_PATTERN.test(username)) {
    return res.status(400).json({
      error:
        "Username must be 3 to 30 characters: letters, numbers, dots, dashes, or underscores.",
    });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }
  if (await findUserByUsername(username)) {
    return res.status(409).json({ error: "That username is already taken." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await createUser({ username, passwordHash });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "That username is already taken." });
    }
    throw error;
  }

  await logIn(req, user);
  res.status(201).json({ user: toPublicUser(user) });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid username or password" });
    }
    req.login(user, (loginError) => {
      if (loginError) return next(loginError);
      res.json({ user: toPublicUser(user) });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  res.json({ user: req.user ? toPublicUser(req.user) : null });
});

export default router;
