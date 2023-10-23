const { getUsers, getUserByUsername } = require("../controller/controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

userRouter.route("/:username").get(getUserByUsername);

module.exports = userRouter;
