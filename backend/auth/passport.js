import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserById, findUserByUsername } from "../db/usersDB.js";

const INVALID = { message: "Invalid username or password" };

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserByUsername(username.trim().toLowerCase());
      if (!user) return done(null, false, INVALID);

      const matches = await bcrypt.compare(password, user.passwordHash);
      if (!matches) return done(null, false, INVALID);

      return done(null, { _id: user._id, username: user.username });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

export default passport;
