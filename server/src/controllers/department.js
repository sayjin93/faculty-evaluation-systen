const Department = require('../models/department');
const Faculty = require('../models/faculty');
const Professors = require('../models/professor');

exports.createDepartment = async (req, res) => {
  if (!req.body.key || !req.body.faculty_id) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const departmentData = {
    key: req.body.key,
    faculty_id: req.body.faculty_id,
  };

  try {
    const data = await Department.create(departmentData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Department',
    });
  }
};
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [{
        model: Faculty,
        attributes: ['key'],
      }],
      paranoid: false, // This includes the soft-deleted records
    });

    if (!departments || departments.length === 0) {
      return res.json({ message: 'No Departments found' });
    }

    res.send(departments);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).send({ message: `Cannot find Department with id=${id}` });
    }
    res.send(department);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving Department with id=${id}` });
  }
};
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await Department.update(req.body, { where: { id } });
    if (Number(num) === 1) {
      res.send({ message: 'Department updated successfully' });
    } else {
      res.send({ message: `Cannot update Department with id=${id}. Maybe Department was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Error updating Department with id=${id}` });
  }
};
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if there are any active (not deleted) departments associated with this faculty
    const activeProfessors = await Professors.count({
      where: {
        department_id: id,
        deletedAt: null, // Ensure only non-deleted departments are counted
      },
    });

    if (activeProfessors > 0) {
      return res.status(409).send({ message: 'Cannot delete Department with active professors' });
    }

    // Proceed with department deletion if no active professors are found
    const num = await Department.destroy({ where: { id } });
    if (Number(num) === 1) {
      res.send({ message: 'Department deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Department with id=${id}. Maybe Department was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Could not delete Department with id=${id}` });
  }
};
exports.restoreDepartments = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await Department.restore({ where: { id } });
    if (Number(num) === 1) {
      res.send({ message: 'Department restored successfully' });
    } else {
      res.send({ message: `Cannot restore Faculty with id=${id}. Maybe Faculty was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Error restoring Faculty with id=${id}` });
  }
};
