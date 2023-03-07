const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max, // max number of connections in the pool
    min: dbConfig.pool.min, // min number of connections in the pool
    acquire: dbConfig.pool.acquire, // max time, in milliseconds, that a pool will try to get connection before throwing error
    idle: dbConfig.pool.idle, // max time, in milliseconds, that a connection can be idle before being released
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importing database models and initializing them with the sequelize and Sequelize instances
db.academic_years = require("./academic_years.model.js")(sequelize, Sequelize);
db.books = require("./books.model.js")(sequelize, Sequelize);
db.community_services = require("./community_services.model.js")(
  sequelize,
  Sequelize
);
db.conferences = require("./conferences.model.js")(sequelize, Sequelize);
db.courses = require("./courses.model.js")(sequelize, Sequelize);
db.papers = require("./papers.model.js")(sequelize, Sequelize);
db.professors = require("./professors.model.js")(sequelize, Sequelize);
db.scientific_works = require("./scientific_works.model.js")(
  sequelize,
  Sequelize
);
db.users = require("./users.model.js")(sequelize, Sequelize);

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
