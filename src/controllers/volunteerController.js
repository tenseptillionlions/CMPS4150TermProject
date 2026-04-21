const TaskModel = require("../models/taskModel");
const taskEventSubject = require("../observers/taskEventSubject");
const { redirectWithMessage } = require("./responseHelpers");
const { renderVolunteerSubscriptionsPage } = require("../views/volunteerView");

async function subscribe(req, res) {
  try {
    const taskId = req.params.taskId;
    const identifier = (req.body.identifier || "").trim();

    const result = await TaskModel.addVolunteer(taskId, identifier);
    if (result.ok) {
      await taskEventSubject.notify({
        type: "volunteer_subscribed",
        taskId
      });
      redirectWithMessage(res, "/", "Subscription recorded.", false);
      return;
    }

    const reasons = {
      invalid_task: "Invalid task id.",
      invalid_identifier: "A unique identifier (for example email) is required.",
      not_found: "Task not found.",
      inactive: "This task is no longer active.",
      already_subscribed: "You are already subscribed to this task.",
      unknown: "Could not subscribe right now."
    };

    redirectWithMessage(res, "/", reasons[result.reason] || reasons.unknown, true);
  } catch (error) {
    console.error("Subscribe failed:", error);
    redirectWithMessage(
      res,
      "/",
      `Subscription failed on server: ${error.message}`,
      true
    );
  }
}

async function lookup(req, res) {
  try {
    const identifier = (req.query.identifier || "").trim().toLowerCase();
    const tasks = identifier ? await TaskModel.getTasksForVolunteer(identifier) : [];

    res.send(
      renderVolunteerSubscriptionsPage({
        user: req.session ? req.session.user : null,
        identifier,
        tasks,
        message: req.query.msg,
        error: req.query.error
      })
    );
  } catch (error) {
    res.status(500).send(`Error loading volunteer subscriptions: ${error.message}`);
  }
}

module.exports = {
  subscribe,
  lookup
};
