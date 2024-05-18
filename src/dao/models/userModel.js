import mongoose from "mongoose";
const usersCollection = "users";
const usersSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    rol: String,
  },
  {
    strict: false,
  }
);

export const usersModel = mongoose.model(usersCollection, usersSchema);
