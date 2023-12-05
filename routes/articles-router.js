const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  postArticle,
  getComments,
  deleteArticle,
} = require("../controller/articles");
const { postComment } = require("../controller/comments");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle);

delete articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
