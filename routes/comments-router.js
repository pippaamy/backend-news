const { deleteComment, patchComment } = require("../controller/controller");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;
