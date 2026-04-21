require("dotenv").config();
const express = require("express");
const session = require("express-session");
const routes = require("./routes");
const DbSingleton = require("./config/dbSingleton");
const UserModel = require("./models/userModel");
const TaskModel = require("./models/taskModel");
const StatisticsModel = require("./models/statisticsModel");
const taskEventSubject = require("./observers/taskEventSubject");
const StatsObserver = require("./observers/statsObserver");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "helpers-system-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax"
    }
  })
);

app.use(routes);

app.use((req, res) => {
  res.status(404).send("Route not found.");
});

app.use((error, req, res, next) => {
  console.error("Unhandled request error:", error);
  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(500).send(`Server error: ${error.message}`);
});

async function startup() {
  await DbSingleton.getDb();
  await UserModel.ensureDefaultOwner();
  await TaskModel.ensureIndexes();
  await StatisticsModel.ensureIndexes();

  const statsObserver = new StatsObserver();
  taskEventSubject.subscribe(statsObserver);
  await taskEventSubject.notify({ type: "rebuild_stats" });

  app.listen(port, () => {
    console.log(`Helpers system started at http://localhost:${port}`);
  });
}

startup().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await DbSingleton.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await DbSingleton.close();
  process.exit(0);
});

module.exports = app;
