module.exports = (sequelize, DataTypes) => {
  const Paper = sequelize.define('Paper', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    journal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publication: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
    },
    professor_id: {
      type: DataTypes.INTEGER,

    },
  }, {
    tableName: 'Paper', // Explicitly declare the table name
  });

  Paper.associate = (models) => {
    Paper.belongsTo(models.Professor, { foreignKey: 'professor_id' });
    Paper.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id' });
  };

  return Paper;
};
