module.exports = (sequelize, Sequelize) => {
  const Courses = sequelize.define('courses', {
    name: {
      type: Sequelize.STRING,
    },
    number: {
      type: Sequelize.STRING,
    },
    semester: {
      type: Sequelize.INTEGER,
    },
    week_hours: {
      type: Sequelize.INTEGER,
    },
    program: {
      type: Sequelize.ENUM('Bachelor', 'Master'),
    },
    academic_year_id: {
      type: Sequelize.INTEGER,
    },
    professor_id: {
      type: Sequelize.INTEGER,
    },
  });

  return Courses;
};
