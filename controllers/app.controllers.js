const {
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertComment,
  selectAllUsers,
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

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
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

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getAllusers = (req, res, next) => {
  selectAllUsers().then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
};
