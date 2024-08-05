const Department = require('../models/department');
const Faculty = require('../models/faculty');

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
    const results = await Department.findAll({
      include: [{
        model: Faculty,
        attributes: ['key'],
      }],
    });

    if (!results || results.length === 0) {
      return res.json({ message: 'No Departments found' });
    }

    const modifiedResult = results.map((result) => ({
      id: result.id,
      key: result.key,
      is_deleted: result.is_deleted,
      faculty_id: result.faculty_id,
      faculty_key: result.Faculty ? result.Faculty.key : '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }));

    res.send(modifiedResult);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getDepartmentsByFaculty = async (req, res) => {
  const { faculty_id } = req.params;

  try {
    const data = await Department.findAll({ where: { faculty_id } });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Departments.',
    });
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
    const num = await Department.destroy({ where: { id } });
    if (Number(num) === 1) {
      res.send({ message: 'Department deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Department with id=${id}. Maybe Department was not found!` });
    }
  } catch (err) {
    res.status(409).send({ message: `Could not delete Department with id=${id}` });
  }
};

exports.deleteAllDepartments = async (req, res) => {
  try {
    const nums = await Department.destroy({ where: {} });
    res.send({ message: `${nums} Departments deleted successfully` });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while removing all Departments' });
  }
};
