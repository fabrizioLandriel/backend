import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UserManager } from "../dao/UserManagerDB.js";
import { createHash, validatePassword } from "../utils.js";
import CartManager from "../dao/CartManagerDB.js";
const userManager = new UserManager();
const cartManager = new CartManager();

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
          let newCart = await cartManager.createCart();
          let newUser = await userManager.createUser({
            name,
            email: username,
            password: createHash(password),
            rol: "user",
            cart: newCart._id,
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
          if (!user) {
            return done(null, false);
          }
          if (
            username == "adminCoder@coder.com" &&
            password == "adminCod3r123"
          ) {
            user = { name: "admin", email: username, rol: "admin" };
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

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost:8081/api/sessions/githubCallback",
      },
      async (tokenAcceso, tokenRefresh, profile, done) => {
        try {
          let email = profile._json.email;
          let name = profile._json.name;
          if (!name || !email) {
            return done(null, false);
          }
          let user = await userManager.getUserBy({ email });
          if (!user) {
            let newCart = await cartManager.createCart();
            user = await userManager.createUser({
              name,
              email,
              rol: "user",
              cart: newCart._id,
              profile,
            });
          }
          return done(null, user);
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
