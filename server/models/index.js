// Importing Sequelize library
const { Sequelize } = require('sequelize');

// Creating a new Sequelize instance with provided database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// Creating an object to hold sequelize and Sequelize instances
const db = {
  sequelize,
  Sequelize,
};

// Importing database models and initializing them with the sequelize and Sequelize instances
const modelNames = [
  'academic_years',
  'books',
  'community_services',
  'conferences',
  'courses',
  'papers',
  'professors',
  'users',
];
for (const modelName of modelNames) {
  const modelDefiner = require(`./${modelName}.js`);
  db[modelName] = modelDefiner(sequelize, Sequelize);
}

// Setting up associations between models using foreign key constraints
db.books.belongsTo(db.professors, { foreignKey: 'professor_id' });
db.books.belongsTo(db.academic_years, { foreignKey: 'academic_year_id' });

db.community_services.belongsTo(db.professors, { foreignKey: 'professor_id' });
db.community_services.belongsTo(db.academic_years, {
  foreignKey: 'academic_year_id',
});

db.conferences.belongsTo(db.professors, { foreignKey: 'professor_id' });
db.conferences.belongsTo(db.academic_years, { foreignKey: 'academic_year_id' });

db.courses.belongsTo(db.professors, { foreignKey: 'professor_id' });
db.courses.belongsTo(db.academic_years, { foreignKey: 'academic_year_id' });

db.papers.belongsTo(db.professors, { foreignKey: 'professor_id' });
db.papers.belongsTo(db.academic_years, { foreignKey: 'academic_year_id' });

// Exporting the database object
module.exports = db;
