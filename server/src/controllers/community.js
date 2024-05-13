const Community = require('../models/community');
const Professor = require('../models/professor');

exports.createCommunityService = async (req, res) => {
  if (!req.body.event) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const communityServiceData = {
    event: req.body.event,
    date: req.body.date || new Date(),
    description: req.body.description,
    external: req.body.external,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  try {
    const data = await Community.create(communityServiceData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message
        || 'Some error occurred while creating the Community Service',
    });
  }
};

exports.getAllCommunityServices = async (req, res) => {
  try {
    const result = await Community.findAll();
    res.json(result || { message: 'Does not exist any Community Service' });
  } catch (err) {
    res.status(500).send({
      message:
        err.message
        || 'Some error occurred while retrieving Community Services',
    });
  }
};

exports.getCommunityServicesByYear = async (req, res) => {
  try {
    const data = await Community.findAll({
      where: { academic_year_id: req.params.academic_year_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((community) => ({
      ...community.get(),
      professor_full_name: `${community.Professor.first_name} ${community.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message:
        err.message
        || 'Some error occurred while retrieving Community Services',
    });
  }
};

exports.getCommunityServiceById = async (req, res) => {
  try {
    const data = await Community.findByPk(req.params.id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Community Service with id=${req.params.id}`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Community Service with id=${req.params.id}`,
    });
  }
};

exports.updateCommunityService = async (req, res) => {
  try {
    const num = await Community.update(req.body, {
      where: { id: req.params.id },
    });
    if (Number(num) === 1) {
      res.send({ message: 'Community Service was updated successfully' });
    } else {
      res.send({
        message: `Cannot update Community Service with id=${req.params.id}. Maybe Community Service was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Community Service with id=${req.params.id}`,
    });
  }
};

exports.deleteCommunityService = async (req, res) => {
  try {
    const num = await Community.destroy({ where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Community Service was deleted successfully' });
    } else {
      res.send({
        message: `Cannot delete Community Service with id=${req.params.id}. Maybe Community Service was not found!`,
      });
    }
  } catch (err) {
    res.status(409).send({
      message: `Could not delete Community Service with id=${req.params.id}`,
    });
  }
};

exports.deleteAllCommunityServices = async (req, res) => {
  try {
    const nums = await Community.destroy({ where: {} });
    res.send({
      message: `${nums} Community Services were deleted successfully`,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message
        || 'Some error occurred while removing all Community Services',
    });
  }
};
