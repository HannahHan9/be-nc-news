const express = require("express");
const { getApiTopics, getApis } = require("./controllers/app.controllers");
const { handleServerErrors } = require("./errors");
const app = express();


app.get("/api/topics", getApiTopics);

app.get("/api", getApis);

app.all("*", (_, res) => {
  res.status(404).send({ status: 404, msg: "Not Found" });
});

app.use(handleServerErrors);

module.exports = app;