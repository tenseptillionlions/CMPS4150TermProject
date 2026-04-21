const { escapeHtml, renderLayout } = require("./helpers");

function renderStatsRows(stats) {
  if (!stats || stats.length === 0) {
    return "<p>No active task statistics available.</p>";
  }

  const rows = stats
    .map(
      (item) => `<tr>
      <td>${escapeHtml(item.title)}</td>
      <td>${escapeHtml(item.ownerUsername)}</td>
      <td>${item.volunteerCount}</td>
      <td>${new Date(item.updatedAt).toLocaleString()}</td>
    </tr>`
    )
    .join("");

  return `<table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Owner</th>
        <th>Current Volunteers</th>
        <th>Last Updated</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderStatsPage({ user, stats, message, error }) {
  const body = `
    <h1>Active Task Statistics</h1>
    <p>Current volunteer counts for all active tasks.</p>
    ${renderStatsRows(stats)}
  `;

  return renderLayout({
    title: "Task Statistics",
    user,
    message,
    error,
    body
  });
}

module.exports = {
  renderStatsPage
};
