const UserModel = require("../models/userModel");
const { redirectWithMessage } = require("./responseHelpers");
const { renderLoginPage, renderRegisterPage } = require("../views/authView");

async function showLogin(req, res) {
  res.send(
    renderLoginPage({
      user: req.session ? req.session.user : null,
      message: req.query.msg,
      error: req.query.error
    })
  );
}

async function login(req, res) {
  try {
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "").trim();

    if (!username || !password) {
      res.send(
        renderLoginPage({
          user: null,
          error: "Enter both username and password."
        })
      );
      return;
    }

    const user = await UserModel.findByCredentials(username, password);
    if (!user) {
      res.send(
        renderLoginPage({
          user: null,
          error: "Invalid credentials."
        })
      );
      return;
    }

    req.session.user = user;
    redirectWithMessage(res, "/owner/tasks", "Login successful.", false);
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).send(`Login failed: ${error.message}`);
  }
}

function showRegister(req, res) {
  res.send(
    renderRegisterPage({
      user: req.session ? req.session.user : null,
      message: req.query.msg,
      error: req.query.error
    })
  );
}

async function register(req, res) {
  try {
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "").trim();

    const result = await UserModel.createUser(username, password);
    if (result.ok) {
      redirectWithMessage(res, "/login", "Account created. You can now log in.", false);
      return;
    }

    const errors = {
      missing: "Username and password are required.",
      exists: "That username already exists."
    };

    res.send(
      renderRegisterPage({
        user: req.session ? req.session.user : null,
        error: errors[result.reason] || "Could not create account."
      })
    );
  } catch (error) {
    console.error("Register failed:", error);
    res.status(500).send(`Registration failed: ${error.message}`);
  }
}

function logout(req, res) {
  if (!req.session) {
    res.redirect("/");
    return;
  }

  req.session.destroy(() => {
    res.redirect("/?msg=Logged+out.");
  });
}

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  logout
};
