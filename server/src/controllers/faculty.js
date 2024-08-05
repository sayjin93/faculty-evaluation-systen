const Faculty = require('../models/faculty');
const Department = require('../models/department');

exports.createFaculty = async (req, res) => {
  if (!req.body.key) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const facultyData = {
    key: req.body.key,
  };

  try {
    const data = await Faculty.create(facultyData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Faculty',
    });
  }
};
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.findAll({
      paranoid: false, // This includes the soft-deleted records
    });
    if (!faculties || faculties.length === 0) {
      return res.status(404).json({ message: 'No Faculties found.' });
    }
    res.json(faculties);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).send({ message: 'Some error occurred while retrieving faculties' });
  }
};
exports.getFacultyById = async (req, res) => {
  const { id } = req.params;

  try {
    const faculty = await Faculty.findByPk(id);
    if (!faculty) {
      return res.status(404).send({ message: `Cannot find Faculty with id=${id}` });
    }
    res.send(faculty);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving Faculty with id=${id}` });
  }
};
exports.updateFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await Faculty.update(req.body, { where: { id } });
    if (Number(num) === 1) {
      res.send({ message: 'Faculty was updated successfully' });
    } else {
      res.send({ message: `Cannot update Faculty with id=${id}. Maybe Faculty was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Error updating Faculty with id=${id}` });
  }
};
exports.deleteFaculty = async (req, res) => {
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
      return res.status(409).send({ message: 'Cannot delete Faculty with active departments' });
    }

    // Proceed with faculty deletion if no active departments are found
    const num = await Faculty.destroy({ where: { id } });
    if (Number(num) === 1) {
      res.send({ message: 'Faculty was deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Faculty with id=${id}. Maybe Faculty was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Could not delete Faculty with id=${id}` });
  }
};
exports.restoreFaculties = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await Faculty.restore({ where: { id } });
    if (Number(num) === 1) {
      res.send({ message: 'Faculty was restored successfully' });
    } else {
      res.send({ message: `Cannot restore Faculty with id=${id}. Maybe Faculty was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Error restoring Faculty with id=${id}` });
  }
};
