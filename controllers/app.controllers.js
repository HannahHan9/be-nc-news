const { selectAllTopics } = require("../models/app.models");
const data = require("../endpoints.json");

exports.getApiTopics = (req, res, next) => {
  selectAllTopics().then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
};

exports.getApis = (req, res) => {
  console.log(data, "DATA");
  res.status(200).send(data);
};
