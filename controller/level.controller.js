const levelModel = require("../model/level.model");

exports.addLevel = async (req, res) => {
  const { levelName, requirement } = req.body;

  await new levelModel({
    levelName: levelName,
    requirement: requirement,
  })
    .save()
    .then((success) => {
      return res.json({
        status: true,
        message: "level added",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.getAll = async (req, res) => {
  await levelModel
    .find()
    .then((success) => {
      return res.json({
        status: true,
        message: "levels",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.delete = async (req, res) => {
  await levelModel
    .findOneAndDelete({ _id: req.params.levelId })
    .then((success) => {
      return res.json({
        status: true,
        message: "level deleted",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};
