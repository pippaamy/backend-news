const { selectTopics } = require("../model/model");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
