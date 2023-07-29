const db = require("../models");
const Professors = db.professors;
const Courses = db.courses;
const Papers = db.papers;
const Books = db.books;
const Conferences = db.conferences;
const CommunityServices = db.community_services;

// Find all Data for a professor in a specific academic year
exports.findAllByAcademicYear = (req, res) => {
  const academic_year_id = req.params.academic_year_id;

  // Use Promise.all to run multiple queries in parallel
  Promise.all([
    Professors.findAll(),
    Courses.findAll({
      where: { academic_year_id: academic_year_id },
    }),
    Papers.findAll({
      where: { academic_year_id: academic_year_id },
    }),
    Books.findAll({
      where: { academic_year_id: academic_year_id },
    }),
    Conferences.findAll({
      where: { academic_year_id: academic_year_id },
    }),
    CommunityServices.findAll({
      where: { academic_year_id: academic_year_id },
    }),
  ])
    .then(
      ([
        professors,
        courses,
        papers,
        books,
        conferences,
        communityServices,
      ]) => {
        const allData = {
          professors: professors,
          courses: courses,
          papers: papers,
          books: books,
          conferences: conferences,
          communityServices: communityServices,
        };
        res.send(allData);
      }
    )
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};
