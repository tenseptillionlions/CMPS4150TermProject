const { escapeHtml, renderLayout } = require("./helpers");

function renderLoginPage({ user, message, error }) {
  const seedUser = process.env.SEED_OWNER_USERNAME || "owner1";
  const seedPass = process.env.SEED_OWNER_PASSWORD || "password123";

  const body = `
    <h1>Owner Login</h1>
    <p>This skeleton seeds one owner account for testing.</p>
    <p><strong>Default username:</strong> ${escapeHtml(seedUser)} | <strong>Default password:</strong> ${escapeHtml(seedPass)}</p>
    <form method="post" action="/login">
      <p>
        <label>Username<br><input name="username" required></label>
      </p>
      <p>
        <label>Password<br><input type="password" name="password" required></label>
      </p>
      <button type="submit">Login</button>
    </form>
    <p>Need an account? <a href="/register">Register a new owner account</a>.</p>
  `;

  return renderLayout({
    title: "Owner Login",
    user,
    message,
    error,
    body
  });
}

function renderRegisterPage({ user, message, error }) {
  const body = `
    <h1>Create Owner Account</h1>
    <form method="post" action="/register">
      <p>
        <label>Username<br><input name="username" required></label>
      </p>
      <p>
        <label>Password<br><input type="password" name="password" required></label>
      </p>
      <button type="submit">Create Account</button>
    </form>
    <p><a href="/login">Back to login</a></p>
  `;

  return renderLayout({
    title: "Register Owner",
    user,
    message,
    error,
    body
  });
}

module.exports = {
  renderLoginPage,
  renderRegisterPage
};
