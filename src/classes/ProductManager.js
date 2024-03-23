import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async validateProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock)
      return "Verificar campos sin llenar";

    if (fs.existsSync(this.path)) {
      await this.addJsonProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      );
    } else {
      await this.createJsonProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      );
    }
  }

  async saveData(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 5));
  }

  async readData() {
    let productData = await fs.promises.readFile(this.path, {
      encoding: "utf-8",
    });
    let parsedData = JSON.parse(productData);
    return parsedData;
  }

  async addJsonProduct(title, description, price, thumbnail, code, stock) {
    let productList = await this.readData();
    let productAdded = {
      id: productList.length + 1,
      title: title,
      description: description,
      price: "$" + price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };
    const codeValidation = productList.some((product) => product.code == code);
    productList.push(productAdded);
    if (codeValidation) {
      return `Codigo ${code} ya esta registrado`;
    }
    await this.saveData(productList);
  }

  async createJsonProduct(title, description, price, thumbnail, code, stock) {
    let cart = [];
    cart.push({
      id: cart.length + 1,
      title: title,
      description: description,
      price: "$" + price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    });
    await this.saveData(cart);
  }

  async getProducts() {
    return await this.readData();
  }

  async getProductsById(id) {
    let productList = await this.readData();
    const search = productList.find((product) => product.id === id);
    if (search) {
      return search;
    } else {
      return "Producto no encontrado";
    }
  }

  async updateProducts(id, productData) {
    // ---> CREAR VARIABLE 'PRODUCTDATA' CON LAS PROPIEDADES DEL PRODUCTO A ACTUALIZAR <---
    let productList = await this.readData();
    let findProduct = productList.find((p) => p.id === id);
    let i = productList.indexOf(findProduct);
    if (i !== -1) {
      const { id, ...rest } = productData;
      productList[i] = { ...productList[i], ...rest };
    }
    await this.saveData(productList);
  }

  async deleteProducts(productId) {
    let productList = await this.readData();
    let findProduct = productList.find((p) => p.id === productId);
    let i = productList.indexOf(findProduct);
    if (i !== -1) {
      productList.splice(i, 1);
    }
    if (!findProduct) {
      return "Producto no existente";
    }
    let newId = 1;
    productList.forEach((p) => {
      p.id = newId++;
    });
    await this.saveData(productList);
  }
}
