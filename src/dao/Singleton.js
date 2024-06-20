import mongoose from "mongoose";

export class Singleton {
  static #connection;
  constructor(url, db) {
    mongoose.connect(url, { dbName: db });
  }

  static connect(url, db) {
    if (this.#connection) {
      console.log("The connection has already been established");
      return this.#connection;
    }

    this.#connection = new Singleton(url, db);
    console.log("DB connected");
    return this.#connection;
  }
}
