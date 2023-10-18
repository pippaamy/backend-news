const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectComments,
  createComment,
  changeArticle,
  removeComment,
  fetchUsers,
} = require("../model/model");
const endpoints = require("../endpoints.json");
const { checkExists } = require("../db/seeds/utils");

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

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  if (topic) {
    Promise.all([checkExists(topic), selectArticles(topic)])
      .then(([check, articles]) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    selectArticles(topic).then((articles) => {
      res.status(200).send({ articles });
    });
  }
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

exports.postComment = (req, res, next) => {
  const { articles_id } = req.params;
  const { username } = req.body;
  const { body } = req.body;
  createComment(articles_id, username, body)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
