function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderLayout({ title, user, message, error, body }) {
  const authBlock = user
    ? `<span>Logged in as <strong>${escapeHtml(user.username)}</strong></span>
       <a href="/owner/tasks">Owner Dashboard</a>
       <form method="post" action="/logout" style="display:inline;">
         <button type="submit">Logout</button>
       </form>`
    : `<a href="/login">Owner Login</a>`;

  const messageBlock = message ? `<p class="msg">${escapeHtml(message)}</p>` : "";
  const errorBlock = error ? `<p class="err">${escapeHtml(error)}</p>` : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 960px; margin: 20px auto; padding: 0 14px; line-height: 1.4; }
    nav { display: flex; gap: 10px; align-items: center; margin-bottom: 18px; flex-wrap: wrap; }
    a { color: #0b4aa5; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .msg { background: #e8f6eb; border: 1px solid #b8dfbf; padding: 8px; }
    .err { background: #fde8e8; border: 1px solid #efb7b7; padding: 8px; }
    .card { border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 4px; }
    .meta { color: #555; font-size: 0.9rem; }
    input, textarea, button { font-size: 1rem; padding: 6px; }
    textarea { width: 100%; min-height: 70px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    ul { padding-left: 18px; }
  </style>
</head>
<body>
  <nav>
    <a href="/">Task Board</a>
    <a href="/subscriptions">My Subscriptions</a>
    <a href="/stats">Statistics</a>
    ${authBlock}
  </nav>
  ${messageBlock}
  ${errorBlock}
  ${body}
</body>
</html>`;
}

module.exports = {
  escapeHtml,
  renderLayout
};
