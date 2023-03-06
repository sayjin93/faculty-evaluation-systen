const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

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

db.academic_year = require("./academic_year.model.js")(sequelize, Sequelize);
db.book = require("./book.model.js")(sequelize, Sequelize);
db.community_service = require("./community_service.model.js")(
  sequelize,
  Sequelize
);
db.conference = require("./conference.model.js")(sequelize, Sequelize);
db.professor = require("./professor.model.js")(sequelize, Sequelize);

module.exports = db;
