const {
  createComment,
  removeComment,
  changeComment,
} = require("../model/comments");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username } = req.body;
  const { body } = req.body;
  createComment(article_id, username, body)
    .then((newComment) => {
      res.status(201).send({ newComment });
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

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const vote = req.body.inc_votes;
  changeComment(comment_id, vote)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
