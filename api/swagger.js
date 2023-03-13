const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./routes/academic_years.routes.js",
  "./routes/books.routes.js",
  "./routes/community_services.routes.js",
  "./routes/conferences.routes.js",
  "./routes/courses.routes.js",
  "./routes/papers.routes.js",
  "./routes/professors.routes.js",
  "./routes/scientific_works.routes.js",
  "./routes/users.routes.js",
]; // add all routes files here

swaggerAutogen(outputFile, endpointsFiles);

module.exports = outputFile;
