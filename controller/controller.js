const { selectTopics, selectArticleById } = require("../model/model");
const endpoints = require("../endpoints.json");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpoints });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
