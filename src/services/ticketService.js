import { sendTicket } from "../config/mailingConfig.js";
import { ticketDAO } from "../dao/factory.js";
import { cartService } from "./CartService.js";
import { productService } from "./ProductService.js";

export class TicketService {
  constructor(dao) {
    this.dao = new dao();
  }
  async getTotalPrice(cart) {
    return cart.reduce((accumulator, products) => {
      let productPrice = Number(products.product.price);
      let productQuantity = Number(products.quantity);
      return accumulator + productPrice * productQuantity;
    }, 0);
  }

  async validateStock(cart) {
    let userCart = await cartService.getCartById(cart);
    let productsWithStock = [];
    let productsWithoutStock = [];
    for (let cartProducts of userCart.products) {
      if (cartProducts.product.stock >= cartProducts.quantity) {
        let product = await productService.getProductsBy({
          _id: cartProducts.product._id,
        });
        product.stock = product.stock - cartProducts.quantity;
        await product.save();
        productsWithStock.push(cartProducts);
        await userCart.save();
      } else {
        productsWithoutStock.push(cartProducts);
      }
    }
    let total = await this.getTotalPrice(productsWithStock);
    return { productsWithStock, productsWithoutStock, total };
  }

  async createTicket(amount, purchaser) {
    return await this.dao.create(amount, purchaser);
  }

  async generateTicket(cart, purchaser) {
    let cartItems = await this.validateStock(cart);
    let ticket = await this.createTicket(cartItems.total, purchaser);
    if (cartItems.productsWithStock.length >= 1) {
      sendTicket(
        purchaser,
        ticket.code,
        cartItems.total,
        purchaser,
        ticket.purchase_datetime
      );
    }
    let newCart = await cartService.getCartById(cart);
    newCart.products = cartItems.productsWithoutStock;
    await newCart.save();
    return ticket;
  }
}

export const ticketService = new TicketService(ticketDAO);
