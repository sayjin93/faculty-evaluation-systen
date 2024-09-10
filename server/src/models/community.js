module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define('Community', {
    event: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    external: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
    },
    professor_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'Community', // Explicitly declare the table name
  });

  Community.associate = (models) => {
    Community.belongsTo(models.Professor, { foreignKey: 'professor_id' });
    Community.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id' });
  };

  return Community;
};
