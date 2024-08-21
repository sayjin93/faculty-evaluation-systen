module.exports = (sequelize, DataTypes) => {
  const Summarize = sequelize.define('Summarize', {
    content: {
      type: DataTypes.STRING,
    },
    professor_id: {
      type: DataTypes.INTEGER,
    },
  });

  Summarize.associate = (models) => {
    Summarize.belongsTo(models.Professor, { foreignKey: 'professor_id' });
  };

  return Summarize;
};
