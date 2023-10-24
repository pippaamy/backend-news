const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  getComments,
  postComment,
  postArticle,
} = require("../controller/controller");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
