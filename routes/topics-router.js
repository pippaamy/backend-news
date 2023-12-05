const { getTopics, postTopic } = require("../controller/topics");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;
