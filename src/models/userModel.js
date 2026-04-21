const DbSingleton = require("../config/dbSingleton");

class UserModel {
  static async collection() {
    const db = await DbSingleton.getDb();
    return db.collection("users");
  }

  static async ensureDefaultOwner() {
    const users = await UserModel.collection();
    await users.createIndex({ username: 1 }, { unique: true });

    const username = process.env.SEED_OWNER_USERNAME || "owner1";
    const password = process.env.SEED_OWNER_PASSWORD || "password123";

    const existing = await users.findOne({ username });
    if (!existing) {
      await users.insertOne({
        username,
        password,
        createdAt: new Date()
      });
    }
  }

  static async findByCredentials(username, password) {
    const users = await UserModel.collection();
    const user = await users.findOne({
      username: (username || "").trim(),
      password: (password || "").trim()
    });

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      username: user.username
    };
  }

  static async createUser(username, password) {
    const users = await UserModel.collection();
    const cleanUsername = (username || "").trim();
    const cleanPassword = (password || "").trim();

    if (!cleanUsername || !cleanPassword) {
      return { ok: false, reason: "missing" };
    }

    try {
      await users.insertOne({
        username: cleanUsername,
        password: cleanPassword,
        createdAt: new Date()
      });
      return { ok: true };
    } catch (error) {
      if (error && error.code === 11000) {
        return { ok: false, reason: "exists" };
      }
      throw error;
    }
  }
}

module.exports = UserModel;
