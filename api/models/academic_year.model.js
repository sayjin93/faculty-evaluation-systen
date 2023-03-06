module.exports = (sequelize, Sequelize) => {
  const AcademicYear = sequelize.define("academic_year", {
    year: {
      type: Sequelize.STRING,
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
  });

  return AcademicYear;
};
