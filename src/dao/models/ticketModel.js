import mongoose from "mongoose";
const ticketsCollection = "tickets";
const ticketsSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: Number,
    purchaser: String,
  },
  {
    strict: false,
  }
);

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
