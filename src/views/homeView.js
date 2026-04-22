const { escapeHtml, renderLayout } = require("./helpers");

function renderTask(task) {
  return `<article class="card">
    <h3>${escapeHtml(task.title)}</h3>
    <p>${escapeHtml(task.description)}</p>
    <p class="meta">Owner: ${escapeHtml(task.ownerUsername)} | Volunteers: ${task.volunteerCount}</p>
    <form method="post" action="/tasks/${escapeHtml(task.id)}/subscribe">
      <label>
        Your unique identifier (email or other id):
        <input name="identifier" required />
      </label>
      <button type="submit">Subscribe / Volunteer</button>
    </form>
  </article>`;
}

function renderHomePage({ user, tasks, message, error, totalVolunteerCount }) {
  const tasksHtml =
    tasks.length === 0
      ? "<p>No active tasks available right now.</p>"
      : tasks.map(renderTask).join("\n");

  const body = `
    <h1>Helpers Task Board</h1>
    <p>Anyone can join our ${totalVolunteerCount} volunteers by entering a unique identifier. Task creation/ownership requires login.</p>
    <p><a href="/login">Login as task owner</a> | <a href="/subscriptions">Find my subscriptions</a></p>
    <section>
      <h2>Active Tasks</h2>
      ${tasksHtml}
    </section>
  `;

  return renderLayout({
    title: "Helpers Task Board",
    user,
    message,
    error,
    body
  });
}

module.exports = {
  renderHomePage
};
