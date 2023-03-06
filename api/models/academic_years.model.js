module.exports = (sequelize, Sequelize) => {
  const AcademicYears = sequelize.define("academic_years", {
    year: {
      type: Sequelize.STRING,
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
  });

  return AcademicYears;
};
