const express = require("express");
const {
  getApiTopics,
  getApis,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
  patchArticleById,
  deleteCommentById,
  getAllusers,
} = require("./controllers/app.controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getApiTopics);

app.get("/api", getApis);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllusers);

app.all("*", (_, res) => {
  res.status(404).send({ status: 404, msg: "Route Not Found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
