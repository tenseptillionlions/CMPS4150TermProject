const StatisticsModel = require("../models/statisticsModel");
const { renderStatsPage } = require("../views/statsView");

async function index(req, res) {
  try {
    const stats = await StatisticsModel.getActiveStats();
    res.send(
      renderStatsPage({
        user: req.session ? req.session.user : null,
        stats,
        message: req.query.msg,
        error: req.query.error
      })
    );
  } catch (error) {
    res.status(500).send(`Error loading statistics: ${error.message}`);
  }
}

module.exports = {
  index
};
