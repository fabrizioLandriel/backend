import { usersModel } from "./models/userModel.js";

export class UserManager {
  async createUser(user) {
    return await usersModel.create(user);
  }

  async getUserBy(filter) {
    return await usersModel.findOne(filter).lean();
  }
}
