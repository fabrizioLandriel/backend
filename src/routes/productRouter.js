import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
export const router = Router();
const productManager = new ProductManager("./src/data/products.json");

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
    let product = await productManager.getProductsById(pId);
    if (product) {
      res.json(product);
    }
  } catch (error) {
    res.status(400).json({ error: `Product ${pId} not found` });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    const products = await productManager.validateProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    );
    res.json(products);
  } catch (error) {
    res.status(300).json({ error: "error creating product" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    pid = parseInt(pid);
    let productChanges = req.body;
    let products = await productManager.updateProducts(pid, productChanges);
    res.json(products);
    console.log(products);
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
});
