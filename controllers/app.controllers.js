const {
  selectAllTopics,
  selectArticleById,
  selectCommentsByArticleId,
} = require("../models/app.models");
const data = require("../endpoints.json");
const { checkExists } = require("../db/seeds/utils");

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
  const promises = [
    selectCommentsByArticleId(article_id),
    checkExists(article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};
