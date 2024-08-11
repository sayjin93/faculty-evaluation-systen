const { Conference, Professor } = require('../models');

exports.createConference = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const conferenceData = {
    name: req.body.name,
    location: req.body.location,
    present_title: req.body.present_title,
    authors: req.body.authors,
    dates: req.body.dates,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  try {
    const data = await Conference.create(conferenceData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Conference',
    });
  }
};

exports.getAllConferences = async (req, res) => {
  try {
    const result = await Conference.findAll();
    res.json(result || { message: 'Does not exist any Conference' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Conferences',
    });
  }
};
exports.getConferencesByProfessor = async (req, res) => {
  try {
    const data = await Conference.findAll({
      where: { professor_id: req.params.professor_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((conference) => ({
      ...conference.get(),
      professor_full_name: `${conference.Professor.first_name} ${conference.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Conferences for the Professor',
    });
  }
};

exports.getConferencesByYear = async (req, res) => {
  try {
    const data = await Conference.findAll({
      where: { academic_year_id: req.params.academic_year_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((conference) => ({
      ...conference.get(),
      professor_full_name: `${conference.Professor.first_name} ${conference.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Conferences',
    });
  }
};

exports.getConferenceById = async (req, res) => {
  try {
    const data = await Conference.findByPk(req.params.id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Conference with id=${req.params.id}`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Conference with id=${req.params.id}`,
    });
  }
};

exports.updateConference = async (req, res) => {
  try {
    const num = await Conference.update(req.body, { where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Conference was updated successfully' });
    } else {
      res.send({ message: `Cannot update Conference with id=${req.params.id}. Maybe Conference was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Conference with id=${req.params.id}`,
    });
  }
};

exports.deleteConference = async (req, res) => {
  try {
    const num = await Conference.destroy({ where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Conference was deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Conference with id=${req.params.id}. Maybe Conference was not found!` });
    }
  } catch (err) {
    res.status(409).send({
      message: `Could not delete Conference with id=${req.params.id}`,
    });
  }
};

exports.deleteAllConferences = async (req, res) => {
  try {
    const nums = await Conference.destroy({ where: {} });
    res.send({ message: `${nums} Conferences were deleted successfully` });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while removing all Conferences',
    });
  }
};
