import { Router } from "express";
export const router = Router();
import { auth } from "../middlewares/auth.js";
import { cartService } from "../services/cartsService.js";
import { productService } from "../services/productsService.js";
import { UserViewDTO } from "../dao/DTO/UserDTO.js";

router.get("/", auth(["admin", "user", "premium"]), (req, res) => {
  res.redirect("/products");
});
router.get("/products", auth(["admin", "user", "premium"]), async (req, res) => {
  let { limit = 10, sort, page = 1, ...filters } = req.query;
  let user = req.session.user;
  let cart = { _id: req.session.user.cart };
  let {
    payload: products,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
  } = await productService.getProductsPaginate(limit, page, sort, filters);
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
    cart,
  });
});

router.get("/realTimeProducts", auth(["admin", "user", "premium"]), async (req, res) => {
  let products = await productService.getAllProducts();
  let user = new UserViewDTO(req.session.user);
  let cart = { _id: req.session.user.cart };
  res.status(200).render("realTimeProducts", { products, user, cart });
});

router.get("/chat", auth(["user"]), (req, res) => {
  res.status(200).render("chat");
});

router.get("/carts/:cid", auth(["admin", "user", "premium"]), async (req, res) => {
  let user = req.session.user;
  let cid = req.params.cid;
  let cart = { _id: req.session.user.cart };
  let userCart = await cartService.getCartById(cid);
  userCart = userCart.products.map((c) => c.toJSON());

  res.status(200).render("carts", { cart, user, userCart });
});

router.get("/register", auth(["public"]), (req, res) => {
  res.render("register");
});
router.get("/login", auth(["public"]), (req, res) => {
  let error = req.query;
  res.render("login", { error });
});

router.get("/profile", auth(["admin", "user", "premium"]), (req, res) => {
  let user = new UserViewDTO(req.session.user);
  let cart = { _id: req.session.user.cart };
  res.render("profile", { user, cart });
});
