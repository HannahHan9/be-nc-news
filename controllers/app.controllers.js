const { selectAllTopics } = require("../models/app.models");

exports.getApiTopics = (req, res) => {
  selectAllTopics()
    .then(({rows}) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => {
      console.log(err);
    });
};
