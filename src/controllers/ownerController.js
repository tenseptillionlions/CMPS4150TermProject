const TaskModel = require("../models/taskModel");
const taskEventSubject = require("../observers/taskEventSubject");
const { redirectWithMessage } = require("./responseHelpers");
const { renderOwnerDashboardPage } = require("../views/ownerView");

async function dashboard(req, res) {
  try {
    const tasks = await TaskModel.getTasksByOwner(req.session.user.id);
    res.send(
      renderOwnerDashboardPage({
        user: req.session.user,
        tasks,
        message: req.query.msg,
        error: req.query.error
      })
    );
  } catch (error) {
    res.status(500).send(`Error loading owner dashboard: ${error.message}`);
  }
}

async function createTask(req, res) {
  try {
    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim();

    if (!title) {
      redirectWithMessage(res, "/owner/tasks", "Task title is required.", true);
      return;
    }

    const createdTask = await TaskModel.createTask({
      title,
      description,
      ownerId: req.session.user.id,
      ownerUsername: req.session.user.username
    });

    await taskEventSubject.notify({
      type: "task_created",
      taskId: createdTask.id
    });

    redirectWithMessage(res, "/owner/tasks", "Task created.", false);
  } catch (error) {
    console.error("Create task failed:", error);
    redirectWithMessage(res, "/owner/tasks", `Could not create task: ${error.message}`, true);
  }
}

async function dismissVolunteer(req, res) {
  try {
    const taskId = req.params.taskId;
    const identifier = (req.body.identifier || "").trim();

    if (!identifier) {
      redirectWithMessage(res, "/owner/tasks", "Volunteer identifier is required.", true);
      return;
    }

    const removed = await TaskModel.removeVolunteerForOwner(
      taskId,
      req.session.user.id,
      identifier
    );

    if (!removed) {
      redirectWithMessage(
        res,
        "/owner/tasks",
        "Volunteer could not be removed. Verify task ownership and identifier.",
        true
      );
      return;
    }

    await taskEventSubject.notify({
      type: "volunteer_dismissed",
      taskId
    });

    redirectWithMessage(res, "/owner/tasks", "Volunteer removed from task.", false);
  } catch (error) {
    console.error("Dismiss volunteer failed:", error);
    redirectWithMessage(
      res,
      "/owner/tasks",
      `Could not dismiss volunteer: ${error.message}`,
      true
    );
  }
}

async function updateTaskActive(req, res) {
  try {
    const taskId = req.params.taskId;
    const activeValue = String(req.body.active || "").toLowerCase();
    const active = activeValue === "true" || activeValue === "1" || activeValue === "yes";

    const updatedTask = await TaskModel.setActiveForOwner(taskId, req.session.user.id, active);
    if (!updatedTask) {
      redirectWithMessage(res, "/owner/tasks", "Task not found or not owned by you.", true);
      return;
    }

    await taskEventSubject.notify({
      type: "task_status_changed",
      taskId
    });

    const stateWord = active ? "active" : "inactive";
    redirectWithMessage(res, "/owner/tasks", `Task marked ${stateWord}.`, false);
  } catch (error) {
    console.error("Update task active failed:", error);
    redirectWithMessage(
      res,
      "/owner/tasks",
      `Could not update task status: ${error.message}`,
      true
    );
  }
}

module.exports = {
  dashboard,
  createTask,
  dismissVolunteer,
  updateTaskActive
};
