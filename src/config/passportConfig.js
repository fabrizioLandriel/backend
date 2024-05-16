import passport from "passport";
import local from "passport-local";
import { UserManager } from "../dao/UserManagerDB.js";
import { createHash } from "../utils.js";

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
          let exist = await userManager.getUserBy({ email });
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

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getUserBy({ _id: id });
    return done(null, user);
  });
};
