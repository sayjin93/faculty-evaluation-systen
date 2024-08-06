const Faculty = require('../models/faculty');
const Department = require('../models/department');

exports.create = async (req, res) => {
  if (!req.body.key) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const facultyData = {
    key: req.body.key,
  };

  try {
    const result = await Faculty.create(facultyData);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Faculty',
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const result = await Faculty.findAll({
      paranoid: false, // This includes the soft-deleted records
    });
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No Faculties found.' });
    }
    res.json(result);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).send({ message: 'Some error occurred while retrieving faculties' });
  }
};
exports.getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Faculty.findByPk(id);
    if (!result) {
      return res.status(404).send({ message: `Cannot find Faculty with id=${id}` });
    }
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving Faculty with id=${id}` });
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Faculty.update(req.body, { where: { id } });
    if (Number(result) === 1) {
      res.send({ message: 'Faculty was updated successfully' });
    } else {
      res.send({ message: `Cannot update Faculty with id=${id}. Maybe Faculty was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Error updating Faculty with id=${id}` });
  }
};
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if there are any active (not deleted) departments associated with this faculty
    const activeDepartments = await Department.count({
      where: {
        faculty_id: id,
        deletedAt: null, // Ensure only non-deleted departments are counted
      },
    });

    if (activeDepartments > 0) {
      return res.status(409).send({ message: 'Cannot delete with existing associations.' });
    }

    // Proceed with faculty deletion if no active departments are found
    const result = await Faculty.destroy({ where: { id } });
    if (Number(result) === 1) {
      res.send({ message: 'Faculty was deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Faculty with id=${id}. Maybe Faculty was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Could not delete Faculty with id=${id}` });
  }
};
exports.restore = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Faculty.restore({ where: { id } });
    if (Number(result) === 1) {
      res.send({ message: 'Faculty was restored successfully' });
    } else {
      res.send({ message: `Cannot restore Faculty with id=${id}. Maybe Faculty was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Error restoring Faculty with id=${id}` });
  }
};
