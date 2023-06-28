const {
  selectAllTopics,
  selectArticleById,
  selectCommentsByArticleId,
} = require("../models/app.models");
const data = require("../endpoints.json");

exports.getApiTopics = (req, res, next) => {
  selectAllTopics().then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
};

exports.getApis = (req, res) => {
  res.status(200).send(data);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};
