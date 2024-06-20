import { ticketonDAO } from "../dao/factory.js";
import { cartService } from "./CartService.js";
import { productService } from "./ProductService.js";

export class TicketService {
  constructor(dao) {
    this.dao = new dao();
  }
  async validateStock(cart) {
    let userCart = await cartService.getCartById(cart);
    let productsWhithStock = [];
    let productsWhithoutStock = [];
    for (let cartProducts of userCart.products) {
      if (cartProducts.product.stock >= cartProducts.quantity) {
        let product = await productService.getProductsBy({
          _id: cartProducts.product._id,
        });
        product.stock = product.stock - cartProducts.quantity;
        await product.save();
        productsWhithStock.push(cartProducts);
        userCart.products = productsWhithStock;
      } else {
        productsWhithoutStock.push(cartProducts);
      }
    }
    return { userCart, productsWhithoutStock };
  }

  async createTicket(amount, purchaser) {
    return await this.dao.create(amount, purchaser);
  }

  async getTotalPrice(cart) {
    return cart.products.reduce((accumulator, products) => {
      let productPrice = Number(products.product.price);
      let productQuantity = Number(products.quantity);
      return accumulator + productPrice * productQuantity;
    }, 0);
  }
}

export const ticketService = new TicketService(ticketonDAO);
