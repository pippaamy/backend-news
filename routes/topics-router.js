const { getTopics } = require("../controller/controller");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
