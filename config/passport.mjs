import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.mjs";

export default function initialize(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "No user found" });

        if (!user.verified) {
          return done(null, false, { message: "Account not verified. Please verify your email." });
        }

        const match = await bcrypt.compare(password, user.password);
        return match ? done(null, user) : done(null, false, { message: "Incorrect password" });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
