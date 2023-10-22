const db = require('../models');

const Courses = db.courses;
const Papers = db.papers;
const Books = db.books;
const Conferences = db.conferences;
const CommunityServices = db.community_services;

// Find all Data for a professor in a specific academic year
exports.findAllByAcademicYearAndProfessor = (req, res) => {
  const { professor_id } = req.params;
  const { academic_year_id } = req.params;

  // Use Promise.all to run multiple queries in parallel
  Promise.all([
    Courses.findAll({
      where: { academic_year_id, professor_id },
    }),
    Papers.findAll({
      where: { academic_year_id, professor_id },
    }),
    Books.findAll({
      where: { academic_year_id, professor_id },
    }),
    Conferences.findAll({
      where: { academic_year_id, professor_id },
    }),
    CommunityServices.findAll({
      where: { academic_year_id, professor_id },
    }),
  ])
    .then(([courses, papers, books, conferences, communityServices]) => {
      const allData = {
        courses,
        papers,
        books,
        conferences,
        communityServices,
      };
      res.send(allData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving data.',
      });
    });
};
