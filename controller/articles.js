const {
  selectArticleById,
  selectArticles,
  changeArticle,
  createArticle,
  removeArticle,
} = require("../model/articles");

const { checkExists } = require("../db/seeds/utils");
const { selectComments } = require("../model/comments");

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

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  const { order } = req.query;
  const { sort_by } = req.query;
  const pageNum = req.query.p;
  const { limit } = req.query;

  if (topic) {
    Promise.all([
      checkExists(topic),
      selectArticles(topic, order, sort_by, pageNum, limit),
    ])
      .then(([check, articles]) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    selectArticles(topic, order, sort_by, pageNum, limit)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;

  const vote = req.body.inc_votes;
  changeArticle(article_id, vote)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author } = req.body;
  const { title } = req.body;
  const { body } = req.body;
  const { topic } = req.body;
  const { article_img_url } = req.body;
  createArticle(author, title, body, topic, article_img_url)
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { limit } = req.query;
  const pageNum = req.query.p;
  const commentPromise = selectComments(article_id, pageNum, limit);
  const articlePromise = selectArticleById(article_id);
  Promise.all([articlePromise, commentPromise])
    .then(([articlePromise, comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
