const express = require("express");
const { getTopics, getApi } = require("./controller/controller");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
