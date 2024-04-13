import { Router } from "express";
import path from "path";
import __dirname from "../utils.js";
export const router = Router();
import ProductManager from "../dao/ProductManager.js";
const productManager = new ProductManager(
  path.join(__dirname, "/data/products.json")
);

router.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  res.status(200).render("home", { products });
});

router.get("/realTimeProducts", async (req, res) => {
  let products = await productManager.getProducts();
  res.status(200).render("realTimeProducts", { products });
});
