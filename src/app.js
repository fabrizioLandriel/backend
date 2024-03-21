const express = require("express");
const ProductManager = require("./classes/ProductManager");
const PORT = 3000;
const app = express();
const productManager = new ProductManager("./src/data/products.json");
app.get("/products", async (req, res) => {
  let products = await productManager.getProducts();
  let limit = req.query.limit;
  if (isNaN(limit) || limit <= 0) {
    return res.json({ error: "El limite debe ser un numero positivo" });
  }
  limit = parseInt(limit);
  let pdata = products;
  if (limit && limit > 0) {
    pdata = pdata.slice(0, limit);
  }

  res.json(pdata);
});

app.get("/products/:id", async (req, res) => {
  let pId = req.params.id;
  pId = Number(pId);
  let product = await productManager.getProductsById(pId);
  if (product) {
    res.json(product);
  }
});

app.listen(PORT, () => console.log(`Server online en puerto:${PORT}`));
