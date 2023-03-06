const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.academic_years = require("./academic_years.model.js")(sequelize, Sequelize);
db.books = require("./books.model.js")(sequelize, Sequelize);
db.community_services = require("./community_services.model.js")(sequelize, Sequelize);
db.conferences = require("./conferences.model.js")(sequelize, Sequelize);
db.courses = require("./courses.model.js")(sequelize, Sequelize);
db.papers = require("./papers.model.js")(sequelize, Sequelize);
db.professors = require("./professors.model.js")(sequelize, Sequelize);
db.scientific_works = require("./scientific_works.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);

module.exports = db;
