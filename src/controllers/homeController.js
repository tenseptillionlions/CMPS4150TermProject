const TaskModel = require("../models/taskModel");
const { renderHomePage } = require("../views/homeView");

async function index(req, res) {
  try {
    const tasks = await TaskModel.getActiveTasks();
    res.send(
      renderHomePage({
        user: req.session ? req.session.user : null,
        tasks,
        message: req.query.msg,
        error: req.query.error
      })
    );
  } catch (error) {
    res.status(500).send(`Error loading tasks: ${error.message}`);
  }
}

module.exports = {
  index
};
