module.exports = (sequelize, DataTypes) => {
  const Conference = sequelize.define('Conference', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    present_title: {
      type: DataTypes.STRING,
    },
    authors: {
      type: DataTypes.STRING,
    },
    dates: {
      type: DataTypes.STRING,
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
    },
    professor_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'Conference', // Explicitly declare the table name
  });

  Conference.associate = (models) => {
    Conference.belongsTo(models.Professor, { foreignKey: 'professor_id' });
    Conference.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id' });
  };

  return Conference;
};
