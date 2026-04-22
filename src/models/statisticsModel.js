const DbSingleton = require("../config/dbSingleton");

class StatisticsModel {
  static async collection() {
    const db = await DbSingleton.getDb();
    return db.collection("taskStatistics");
  }

  static async ensureIndexes() {
    const stats = await StatisticsModel.collection();
    await stats.createIndex({ taskId: 1 }, { unique: true });
    await stats.createIndex({ active: 1, volunteerCount: -1 });
  }

  static async upsertTaskStat(task) {
    const stats = await StatisticsModel.collection();
    await stats.updateOne(
      { taskId: task.id },
      {
        $set: {
          taskId: task.id,
          title: task.title,
          ownerUsername: task.ownerUsername,
          active: task.active,
          volunteerCount: task.volunteerCount,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  static async removeTaskStat(taskId) {
    const stats = await StatisticsModel.collection();
    await stats.deleteOne({ taskId: String(taskId) });
  }

  static async rebuildFromTasks(tasks) {
    const stats = await StatisticsModel.collection();
    await stats.deleteMany({});

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return;
    }

    const docs = tasks.map((task) => ({
      taskId: task.id,
      title: task.title,
      ownerUsername: task.ownerUsername,
      active: task.active,
      volunteerCount: task.volunteerCount,
      updatedAt: new Date()
    }));
    await stats.insertMany(docs);
  }

  static async getActiveStats() {
    const stats = await StatisticsModel.collection();
    return stats
      .find({ active: true })
      .sort({ volunteerCount: -1, title: 1 })
      .toArray();
  }

  static async getTotalVolunteerCount() {
  const stats = await StatisticsModel.collection();
  const result = await stats.aggregate([
    { $match: { active: true } },
    { $group: { _id: null, total: { $sum: "$volunteerCount" } } }
  ]).toArray();
  return result[0]?.total || 0;
}
}

module.exports = StatisticsModel;
