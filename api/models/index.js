const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {
  sequelize,
  Sequelize,
};

// Importing database models and initializing them with the sequelize and Sequelize instances
const modelNames = [
  "academic_years",
  "books",
  "community_services",
  "conferences",
  "courses",
  "papers",
  "professors",
  "scientific_works",
  "users",
];
for (let modelName of modelNames) {
  const modelDefiner = require(`./${modelName}.model.js`);
  db[modelName] = modelDefiner(sequelize, Sequelize);
}

// Setting up associations between models using foreign key constraints
db.courses.belongsTo(db.professors, { foreignKey: "professor_id" });
db.courses.belongsTo(db.academic_years, { foreignKey: "academic_year_id" });

db.community_services.belongsTo(db.professors, { foreignKey: "professor_id" });
db.community_services.belongsTo(db.academic_years, {
  foreignKey: "academic_year_id",
});

db.scientific_works.belongsTo(db.academic_years, {
  foreignKey: "academic_year_id",
});
db.scientific_works.belongsTo(db.professors, { foreignKey: "professor_id" });

db.books.belongsTo(db.scientific_works, { foreignKey: "scientific_work_id" });
db.papers.belongsTo(db.scientific_works, { foreignKey: "scientific_work_id" });
db.conferences.belongsTo(db.scientific_works, {
  foreignKey: "scientific_work_id",
});

module.exports = db;
