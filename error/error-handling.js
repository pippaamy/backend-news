exports.psqlBasicError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
};

exports.psqlComplexError = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Path not found" });
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};
