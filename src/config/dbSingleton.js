const { MongoClient } = require("mongodb");

class DbSingleton {
  static async getDb() {
    if (DbSingleton.db) {
      return DbSingleton.db;
    }

    const uri = process.env.MONGO_URI || process.env.mongo_uri;
    if (!uri) {
      throw new Error("Missing MongoDB connection string. Set MONGO_URI or mongo_uri.");
    }

    DbSingleton.client = new MongoClient(uri);
    await DbSingleton.client.connect();
    DbSingleton.db = DbSingleton.client.db(process.env.DB_NAME || "cmps4150_helpers");
    return DbSingleton.db;
  }

  static async close() {
    if (!DbSingleton.client) {
      return;
    }

    await DbSingleton.client.close();
    DbSingleton.client = null;
    DbSingleton.db = null;
  }
}

DbSingleton.client = null;
DbSingleton.db = null;

module.exports = DbSingleton;
