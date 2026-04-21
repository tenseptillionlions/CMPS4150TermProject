const TaskModel = require("../models/taskModel");
const StatisticsModel = require("../models/statisticsModel");

class StatsObserver {
  async update(event) {
    if (!event || !event.type) {
      return;
    }

    if (event.type === "rebuild_stats") {
      await this.rebuildAll();
      return;
    }

    if (!event.taskId) {
      return;
    }

    await this.refreshTask(event.taskId);
  }

  async refreshTask(taskId) {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      await StatisticsModel.removeTaskStat(taskId);
      return;
    }

    await StatisticsModel.upsertTaskStat(task);
  }

  async rebuildAll() {
    const tasks = await TaskModel.getAllTasks();
    await StatisticsModel.rebuildFromTasks(tasks);
  }
}

module.exports = StatsObserver;
