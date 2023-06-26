const express = require("express");
const { getApiTopics } = require("./controllers/app.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getApiTopics);

module.exports = app;
