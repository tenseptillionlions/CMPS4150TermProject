function redirectWithMessage(res, path, message, isError) {
  const params = new URLSearchParams();
  if (message) {
    params.set(isError ? "error" : "msg", message);
  }

  const query = params.toString();
  if (!query) {
    return res.redirect(path);
  }

  const separator = path.includes("?") ? "&" : "?";
  return res.redirect(`${path}${separator}${query}`);
}

module.exports = {
  redirectWithMessage
};
