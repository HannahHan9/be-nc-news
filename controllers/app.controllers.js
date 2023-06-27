const { selectAllTopics } = require("../models/app.models");

exports.getApiTopics = (req, res, next) => {
  selectAllTopics().then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
};
