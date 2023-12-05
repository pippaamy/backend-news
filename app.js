const express = require("express");
const apiRouter = require("./routes/api-router.js");
const cors = require("cors");
const app = express();
app.use(express.json());

const {
  customErrors,
  psqlBasicError,
  psqlComplexError,
} = require("./error/error-handling");

app.use(cors());
app.use("/api", apiRouter);

app.use(customErrors);

app.use(psqlBasicError);
app.use(psqlComplexError);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
