import { Router } from "express";
import { UserManager } from "../dao/UserManagerDB.js";
import { validatePassword } from "../utils.js";
import passport from "passport";

export const router = Router();
const userManager = new UserManager();

router.get("/error", (req, res) => {
  return res.status(500).json({ error: "Authentication error" });
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    return res
      .status(201)
      .json({ payload: "Successful registration", newUser: req.user });
  }
);

router.post("/login", async (req, res) => {
  let { email, password, web } = req.body;
  if (!email || !password) {
    if (web) {
      return res.redirect(`/login?error=Please complete all fields`);
    } else {
      return res.status(400).json({ error: "Please complete all fields" });
    }
  }

  let user = await userManager.getUserBy({ email });
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    user = { name: "admin", email, rol: "admin" };
  }

  if (!user) {
    if (web) {
      return res.redirect("/login?error=invalid credentials");
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  }
  if (!validatePassword(password, user)) {
    if (web) {
      return res.redirect("/login?error=invalid credentials");
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  }
  user = { ...user };
  delete user.password;
  req.session.user = user;

  if (web) {
    res.redirect("/products");
  } else {
    return res.json({ payload: "Successfull login" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  });
  return res.json({ payload: "logout successfull" });
});
