const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");
const ownerController = require("../controllers/ownerController");
const volunteerController = require("../controllers/volunteerController");
const statsController = require("../controllers/statsController");

const router = express.Router();

router.get("/", homeController.index);

router.get("/login", authController.showLogin);
router.get("/register", authController.showRegister);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);

router.get("/subscriptions", volunteerController.lookup);
router.post("/tasks/:taskId/subscribe", volunteerController.subscribe);

router.get("/owner/tasks", requireAuth, ownerController.dashboard);
router.post("/owner/tasks", requireAuth, ownerController.createTask);
router.post("/owner/tasks/:taskId/dismiss", requireAuth, ownerController.dismissVolunteer);
router.post("/owner/tasks/:taskId/active", requireAuth, ownerController.updateTaskActive);

router.get("/stats", statsController.index);

module.exports = router;
