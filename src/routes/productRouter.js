import { Router } from "express";
import path from "path";
import ProductManager from "../dao/ProductManager.js";
import __dirname from "../utils.js";
import { io } from "../app.js";
export const router = Router();
const productManager = new ProductManager(
  path.join(__dirname, "/data/products.json")
);

router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let limit = req.query.limit;

    limit = Number(limit);
    let pdata = products;
    if (limit && limit > 0) {
      pdata = pdata.slice(0, limit);
    } else {
      pdata;
    }
    res.json(pdata);
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    let pId = req.params.pid;
    pId = Number(pId);
    const product = await productManager.getProductsById(pId);
    if (product) {
      res.json(product);
    }
  } catch (error) {
    res.status(400).json({ error: `Product ${pId} not found` });
  }
});

router.post("/", async (req, res) => {
  try {
    const products = await productManager.validateProduct({ ...req.body });
    res.json(products);
  } catch (error) {
    res.status(300).json({ error: "error creating product" });
  }
  const productList = await productManager.getProducts();
  io.emit("updateProducts", productList);
});

router.put("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    pid = parseInt(pid);
    let productChanges = req.body;
    const products = await productManager.updateProducts(pid, productChanges);
    res.json(products);
  } catch (error) {
    res.status(300).json({ error: "Error when modifying the product" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    pid = parseInt(pid);
    const products = await productManager.deleteProducts(pid);
    res.json(products);
  } catch (error) {
    res.status(300).json({ error: `error deleting product ${pid}` });
  }
  const productList = await productManager.getProducts();
  io.emit("deleteProducts", productList);
});
