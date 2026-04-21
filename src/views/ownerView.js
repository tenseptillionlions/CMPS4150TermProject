const { escapeHtml, renderLayout } = require("./helpers");

function renderVolunteerList(task) {
  if (!task.volunteers || task.volunteers.length === 0) {
    return "<p class=\"meta\">No volunteers yet.</p>";
  }

  const items = task.volunteers
    .map(
      (volunteer) => `<li>
      ${escapeHtml(volunteer.identifier)}
      <form method="post" action="/owner/tasks/${escapeHtml(task.id)}/dismiss" style="display:inline;">
        <input type="hidden" name="identifier" value="${escapeHtml(volunteer.identifier)}">
        <button type="submit">Dismiss</button>
      </form>
    </li>`
    )
    .join("");

  return `<ul>${items}</ul>`;
}

function renderTaskCard(task) {
  const nextActive = task.active ? "false" : "true";
  const toggleText = task.active ? "Mark Inactive" : "Mark Active";
  const activeText = task.active ? "Active" : "Inactive";

  return `<article class="card">
    <h3>${escapeHtml(task.title)} <small>(${activeText})</small></h3>
    <p>${escapeHtml(task.description)}</p>
    <p class="meta">Volunteer count: ${task.volunteerCount}</p>
    <form method="post" action="/owner/tasks/${escapeHtml(task.id)}/active">
      <input type="hidden" name="active" value="${nextActive}">
      <button type="submit">${toggleText}</button>
    </form>
    <h4>Volunteers</h4>
    ${renderVolunteerList(task)}
  </article>`;
}

function renderOwnerDashboardPage({ user, tasks, message, error }) {
  const tasksHtml =
    tasks.length === 0
      ? "<p>You do not own any tasks yet.</p>"
      : tasks.map(renderTaskCard).join("\n");

  const body = `
    <h1>Owner Dashboard</h1>
    <section class="card">
      <h2>Create New Task</h2>
      <form method="post" action="/owner/tasks">
        <p>
          <label>Task title<br><input name="title" required></label>
        </p>
        <p>
          <label>Description<br><textarea name="description"></textarea></label>
        </p>
        <button type="submit">Create Task</button>
      </form>
    </section>
    <section>
      <h2>Your Tasks</h2>
      ${tasksHtml}
    </section>
  `;

  return renderLayout({
    title: "Owner Dashboard",
    user,
    message,
    error,
    body
  });
}

module.exports = {
  renderOwnerDashboardPage
};
