const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectComments,
} = require("../model/model");
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

exports.getArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const commentPromise = selectComments(article_id);
  const articlePromise = selectArticleById(article_id);
  Promise.all([articlePromise, commentPromise])
    .then(([articlePromise, comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
