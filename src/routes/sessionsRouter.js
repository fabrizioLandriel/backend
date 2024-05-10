import { Router } from "express";
import { UserManager } from "../dao/UserManagerDB.js";
import { passwordHash } from "../utils.js";

export const router = Router();
const userManager = new UserManager();

router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please complete all fields" });
  }
  try {
    let exist = await userManager.getUserBy({ email });
    if (exist) {
      return res.status(400).json({ error: `${email} is already registered` });
    }
  } catch (error) {
    res.status(500).json({ error: "Unexpected server error" });
  }

  try {
    let newUser = await userManager.createUser({
      name,
      email,
      password: passwordHash(password),
      rol: "user",
    });
    return res.json({ payload: "Successful registration", newUser });
  } catch (error) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

router.post("/login", async (req, res) => {
  let { email, password, web } = req.body;
  if (!email || !password) {
    if (web) {
      return res.redirect(`/login?error=Please complete all fields`);
    } else {
      return res.status(400).json({ error: "Please complete all fields" });
    }
  }

  let user = await userManager.getUserBy({
    email,
    password: passwordHash(password),
  });
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    user = { name: "admin", email, rol: "admin" };
  }

  if (!user) {
    if (web) {
      return res.status(400).redirect("/login?error=invalid credentials");
    }
  }

  user = { ...user };
  delete user.password;
  req.session.user = user;

  if (web) {
    res.redirect("/profile");
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
