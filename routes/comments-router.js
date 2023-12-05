const { deleteComment, patchComment } = require("../controller/comments");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;
