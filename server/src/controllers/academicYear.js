const Sequelize = require('sequelize');

const AcademicYear = require('../models/academicYear');

// Create a new Academic Year
exports.createAcademicYear = async (req, res) => {
  if (!req.body.year) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  try {
    await AcademicYear.update({ active: 0 }, { where: {} });

    const academicYearData = {
      year: req.body.year,
      active: 1,
    };

    const data = await AcademicYear.create(academicYearData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Academic Year.',
    });
  }
};

// Retrieve all Academic Years
exports.listAll = async (req, res) => {
  try {
    const result = await AcademicYear.findAll();
    if (!result) {
      return res.status(404).json({
        message: 'Does not exist any Academic Year!',
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Academic Years.',
    });
  }
};

// Retrieve all active Academic Years
exports.listActive = async (req, res) => {
  try {
    const data = await AcademicYear.findAll({ where: { active: true } });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving active Academic Years.',
    });
  }
};

// Retrieve a single Academic Year by ID
exports.findAcademicYearById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await AcademicYear.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Academic Year with id=${id}.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Academic Year with id=${id}`,
    });
  }
};

// Update an Academic Year by ID
exports.updateAcademicYear = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await AcademicYear.update(req.body, { where: { id } });
    if (Number(num) === 1) {
      res.send({
        message: 'Academic Year was updated successfully.',
      });
    } else {
      res.send({
        message: `Cannot update Academic Year with id=${id}. Maybe Academic Year was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Academic Year with id=${id}`,
    });
  }
};

// Update the active status of academic years
exports.updateActiveStatus = async (req, res) => {
  const activeId = req.params.id;

  try {
    const num = await AcademicYear.update({ active: false }, { where: { id: { [Sequelize.Op.ne]: activeId } } });
    if (Number(num) > 0) {
      await AcademicYear.update({ active: true }, { where: { id: activeId } });
      res.send({
        message: 'Academic Year active status updated successfully.',
      });
    } else {
      res.status(404).send({
        message: 'No Academic Years found to update the active status. Make sure the specified id exists.',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error updating Academic Year active status.',
    });
  }
};

// Delete an Academic Year by ID
exports.deleteAcademicYear = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await AcademicYear.destroy({ where: { id } });
    if (Number(num) === 1) {
      res.send({
        message: 'Academic Year was deleted successfully!',
      });
    } else {
      res.status(404).send({
        message: `Cannot delete Academic Year with id=${id}. Maybe Academic Year was not found!`,
      });
    }
  } catch (err) {
    res.status(409).send({
      message: `Could not delete Academic Year with id=${id}`,
    });
  }
};

// Delete all Academic Years
exports.deleteAllAcademicYears = async (req, res) => {
  try {
    const nums = await AcademicYear.destroy({
      where: {},
      truncate: false,
    });
    res.send({
      message: `${nums} Academic Years were deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while removing all Academic Years.',
    });
  }
};
