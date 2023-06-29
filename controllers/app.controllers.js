const {
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
  insertComment,
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

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(newComment).then((comment) => {
    res.status(201).send({ comment });
  });
};
