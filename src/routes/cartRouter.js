import { Router } from "express";
export const router = Router();
import CartManager from "../dao/CartManager.js";
const cartManager = new CartManager("./src/data/cart.json");

router.post("/", async (req, res) => {
  try {
    let cart = await cartManager.validateCart();
    res.json(cart);
  } catch (error) {
    res.status(300).json({ error: "error creating cart" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid;
    cid = Number(cid);
    let cartById = await cartManager.getCartById(cid);
    res.json(cartById);
  } catch (error) {
    res.status(300).json({ error: `error getting cart ${cid}` });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cid = Number(req.params.cid);
    let pid = Number(req.params.pid);

    await cartManager.addProducts(cid, pid);
    let showCart = await cartManager.getCartById(cid);
    res.json(showCart);
  } catch (error) {
    res
      .status(300)
      .json({ error: `error when adding product ${pid} to cart ${cid}` });
  }
});
