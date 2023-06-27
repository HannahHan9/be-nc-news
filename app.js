const express = require("express");
const {
  getApiTopics,
  getApis,
  getArticleById,
} = require("./controllers/app.controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
const app = express();

app.get("/api/topics", getApiTopics);

app.get("/api", getApis);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (_, res) => {
  res.status(404).send({ status: 404, msg: "Route Not Found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
