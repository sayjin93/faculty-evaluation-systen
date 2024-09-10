module.exports = (sequelize, DataTypes) => {
  const Summarize = sequelize.define('Summarize', {
    content: {
      type: DataTypes.TEXT,
    },
    professor_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'Summarize', // Explicitly declare the table name
  });

  Summarize.associate = (models) => {
    Summarize.belongsTo(models.Professor, { foreignKey: 'professor_id' });
  };

  return Summarize;
};
