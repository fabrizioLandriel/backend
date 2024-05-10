import { Router } from "express";
export const router = Router();
import ProductManager from "../dao/ProductManagerDB.js";
import CartManager from "../dao/CartManagerDB.js";
import { auth } from "../middlewares/auth.js";
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", auth, async (req, res) => {
  let { limit, sort, page, ...filters } = req.query;
  let user = req.session.user;
  let {
    payload: products,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
  } = await productManager.getProducts(limit, page, sort, filters);
  res.status(200).render("home", {
    products,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
    user,
  });
});

router.get("/realTimeProducts", async (req, res) => {
  let { payload: products } = await productManager.getProducts();
  let user = req.session.user;
  res.status(200).render("realTimeProducts", { products, user });
});

router.get("/chat", (req, res) => {
  res.status(200).render("chat");
});

router.get("/carts/:cid", async (req, res) => {
  let user = req.session.user;
  let cid = req.params.cid;
  let cart = await cartManager.getCartById(cid);
  cart = cart.products.map((c) => c.toJSON());

  res.status(200).render("carts", { cart, user });
});

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  let error = req.query;
  res.render("login", { error });
});

router.get("/profile", (req, res) => {
  let user = req.session.user;
  res.render("profile", { user });
});
