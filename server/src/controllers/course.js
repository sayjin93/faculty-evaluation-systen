const { Course, Professor } = require('../models');

exports.createCourse = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const courseData = {
    name: req.body.name,
    number: req.body.number,
    semester: req.body.semester,
    week_hours: req.body.week_hours,
    program: req.body.program,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  try {
    const data = await Course.create(courseData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Course',
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const result = await Course.findAll();
    res.json(result || { message: 'Does not exist any Course' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Courses',
    });
  }
};
exports.getCoursesByProfessor = async (req, res) => {
  try {
    const data = await Course.findAll({
      where: { professor_id: req.params.professor_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((course) => ({
      ...course.get(),
      professor_full_name: `${course.Professor.first_name} ${course.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Courses for the Professor',
    });
  }
};

exports.getCoursesByYear = async (req, res) => {
  try {
    const data = await Course.findAll({
      where: { academic_year_id: req.params.academic_year_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((course) => ({
      ...course.get(),
      professor_full_name: `${course.Professor.first_name} ${course.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Courses',
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const data = await Course.findByPk(req.params.id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Course with id=${req.params.id}`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Course with id=${req.params.id}`,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const num = await Course.update(req.body, { where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Course updated successfully' });
    } else {
      res.send({ message: `Cannot update Course with id=${req.params.id}. Maybe Course was not found or req.body is empty` });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Course with id=${req.params.id}`,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const num = await Course.destroy({ where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Course was deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Course with id=${req.params.id}. Maybe Course was not found!` });
    }
  } catch (err) {
    res.status(409).send({
      message: `Could not delete Course with id=${req.params.id}`,
    });
  }
};

exports.deleteAllCourses = async (req, res) => {
  try {
    const nums = await Course.destroy({ where: {} });
    res.send({ message: `${nums} Courses were deleted successfully` });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while removing all Courses',
    });
  }
};
