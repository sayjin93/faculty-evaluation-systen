const Paper = require('../models/paper');
const Professor = require('../models/professor');

exports.createPaper = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const paperData = {
    title: req.body.title,
    journal: req.body.journal,
    publication: req.body.publication,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  try {
    const data = await Paper.create(paperData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Paper',
    });
  }
};

exports.getAllPapers = async (req, res) => {
  try {
    const result = await Paper.findAll();
    res.json(result || { message: 'Does not exist any Paper' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Papers',
    });
  }
};

exports.getPapersByYear = async (req, res) => {
  try {
    const data = await Paper.findAll({
      where: { academic_year_id: req.params.academic_year_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((paper) => ({
      ...paper.get(),
      professor_full_name: `${paper.Professor.first_name} ${paper.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Papers',
    });
  }
};

exports.getPaperById = async (req, res) => {
  try {
    const data = await Paper.findByPk(req.params.id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Paper with id=${req.params.id}`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Paper with id=${req.params.id}`,
    });
  }
};

exports.updatePaper = async (req, res) => {
  try {
    const num = await Paper.update(req.body, { where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Paper was updated successfully' });
    } else {
      res.send({ message: `Cannot update Paper with id=${req.params.id}. Maybe Paper was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Paper with id=${req.params.id}`,
    });
  }
};

exports.deletePaper = async (req, res) => {
  try {
    const num = await Paper.destroy({ where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Paper was deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Paper with id=${req.params.id}. Maybe Paper was not found!` });
    }
  } catch (err) {
    res.status(409).send({
      message: `Could not delete Paper with id=${req.params.id}`,
    });
  }
};

exports.deleteAllPapers = async (req, res) => {
  try {
    const nums = await Paper.destroy({ where: {} });
    res.send({ message: `${nums} Papers were deleted successfully` });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while removing all Papers',
    });
  }
};
