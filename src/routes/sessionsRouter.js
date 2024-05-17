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
  let { web } = req.body;
  let user = { ...req.user };
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
  res.json({ payload: "logout successfull" });
});
