const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const userRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const { getApi } = require("../controller/controller");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getApi);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
