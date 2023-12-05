const { selectTopics, addTopic } = require("../model/topics");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const { slug } = req.body;
  const { description } = req.body;
  addTopic(slug, description)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};
