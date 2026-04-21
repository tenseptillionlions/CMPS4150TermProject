const { escapeHtml, renderLayout } = require("./helpers");

function renderSubscriptionRows(tasks) {
  if (!tasks || tasks.length === 0) {
    return "<p>No subscribed tasks were found for this identifier.</p>";
  }

  const rows = tasks
    .map(
      (task) => `<tr>
      <td>${escapeHtml(task.title)}</td>
      <td>${escapeHtml(task.description)}</td>
      <td>${task.active ? "Active" : "Inactive"}</td>
      <td>${task.volunteerCount}</td>
      <td>${escapeHtml(task.ownerUsername)}</td>
    </tr>`
    )
    .join("");

  return `<table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Description</th>
        <th>Status</th>
        <th>Total Volunteers</th>
        <th>Owner</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderVolunteerSubscriptionsPage({ user, identifier, tasks, message, error }) {
  const body = `
    <h1>My Subscriptions</h1>
    <p>Enter the same unique identifier used during volunteer signup.</p>
    <form method="get" action="/subscriptions">
      <label>
        Identifier:
        <input name="identifier" value="${escapeHtml(identifier)}" required>
      </label>
      <button type="submit">Find My Tasks</button>
    </form>
    ${
      identifier
        ? `<h2>Results for "${escapeHtml(identifier)}"</h2>${renderSubscriptionRows(tasks)}`
        : ""
    }
  `;

  return renderLayout({
    title: "My Subscriptions",
    user,
    message,
    error,
    body
  });
}

module.exports = {
  renderVolunteerSubscriptionsPage
};
