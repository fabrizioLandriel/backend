import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { type } from "os";
const productsCollection = "products";
const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: Array,
  owner: {
    type: String,
    default : "admin"
  }
});

productsSchema.plugin(paginate);

export const productsModel = mongoose.model(productsCollection, productsSchema);
