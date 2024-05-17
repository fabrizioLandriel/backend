import passport from "passport";
import local from "passport-local";
import { UserManager } from "../dao/UserManagerDB.js";
import { createHash, validatePassword } from "../utils.js";

const userManager = new UserManager();

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { name } = req.body;
          if (!name) {
            return done(null, false);
          }
          let exist = await userManager.getUserBy({ email: username });
          if (exist) {
            return done(null, false);
          }
          let newUser = await userManager.createUser({
            name,
            email: username,
            password: createHash(password),
            rol: "user",
          });
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userManager.getUserBy({ email: username });
          if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
            user = { name: "admin", email: username, rol: "admin" };
          }
          if (!user) {
            return done(null, false);
          }
          if (!validatePassword(password, user)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getUserBy({ _id: id });
    return done(null, user);
  });
};
