import { cartService } from "../services/CartService.js";
import { isValidObjectId } from "mongoose";
import { ticketService } from "../services/ticketService.js";

export class CartController {
  static getAllCarts = async (req, res) => {
    try {
      let getAllCarts = await cartService.getAllCarts();
      return res.json({ getAllCarts });
    } catch (error) {
      res.status(500).json({ error: `error getting carts: ${error.message}` });
    }
  };

  static createCart = async (req, res) => {
    try {
      await cartService.createCart();
      return res.json({
        payload: `Cart created!`,
      });
    } catch (error) {
      res.status(500).json({ error: "error creating cart" });
    }
  };

  static getCartById = async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    try {
      let cartById = await cartService.getCartById(cid);
      if (!cartById) {
        return res.status(300).json({ error: "Cart not found" });
      } else {
        res.json({ cartById });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: `error getting cart ${cid}, ${error.message}` });
    }
  };

  static addProductToCart = async (req, res) => {
    let { cid, pid } = req.params;

    if (!isValidObjectId(cid, pid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid || !pid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartService.addProductToCart(cid, pid);
      let cartUpdated = await cartService.getCartById(cid);
      res.json({ payload: cartUpdated });
    } catch (error) {
      res
        .status(500)
        .json({ error: `error when adding product ${pid} to cart ${cid}` });
    }
  };

  static deleteProductInCart = async (req, res) => {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid || !pid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartService.deleteProductInCart(cid, pid);
      return res.json({ payload: `Product ${pid} deleted from cart ${cid}` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static updateProductInCart = async (req, res) => {
    let { cid, pid } = req.params;
    let { quantity } = req.body;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid || !pid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartService.updateProductInCart(cid, pid, quantity);
      res.json({ payload: `Product ${pid} updated` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static deleteAllProductsInCart = async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartService.deleteAllProductsInCart(cid);
      res.json({ payload: `Products deleted from cart ${cid}` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static updateAllCart = async (req, res) => {
    let { cid } = req.params;
    let toUpdate = req.body;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid) {
      return res.status(400).json({ error: "Cart ID is missing" });
    }

    if (!toUpdate.product || !toUpdate.quantity) {
      return res.status(400).json({ error: "Invalid Cart" });
    }

    try {
      await cartService.updateAllCart(cid, toUpdate);
      res.json({ payload: `Cart ${cid} updated` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static createTicket = async (req, res) => {
    let cart = req.session.user.cart;
    let purchaser = req.session.user.email;
    // if (!isValidObjectId(cid)) {
    //   return res.status(400).json({
    //     error: `Enter a valid MongoDB id`,
    //   });
    // }

    try {
      let ticket = await ticketService.generateTicket(cart, purchaser);
      res.json({ ticket });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };
}
