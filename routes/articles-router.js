const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  getComments,
  postComment,
} = require("../controller/controller");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
