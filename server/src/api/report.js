const express = require('express');
const passport = require('passport');
const Sequelize = require('sequelize');

const AcademicYear = require('../models/academicYear');
const Book = require('../models/book');
const Community = require('../models/community');
const Conference = require('../models/conference');
const Course = require('../models/course');
const Paper = require('../models/paper');
const Professor = require('../models/professor');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Retrieve all professors data for selected academic year.
router.get('/dashboard', auth, async (req, res) => {
  await AcademicYear.findAll()
    .then((academicYears) => {
      const academic_year_ids = academicYears.map((year) => year.id);

      Professor.findAll({ where: { is_admin: false } })
        .then((professors) => {
          const professorsData = professors;

          const promises = academic_year_ids.map((academic_year_id) => Promise.all([
            Course.findAll({
              where: { academic_year_id },
            }),
            Paper.findAll({
              where: { academic_year_id },
            }),
            Book.findAll({
              where: { academic_year_id },
            }),
            Conference.findAll({
              where: { academic_year_id },
            }),
            Community.findAll({
              where: { academic_year_id },
            }),
          ]));

          return Promise.all(promises).then((results) => {
            const allDataForEachYear = results.map((data, index) => {
              const academic_year_id = academic_year_ids[index];
              const [courses, papers, books, conferences, communityServices] = data;

              // Extracting only the professor_id and week_hours properties for each course
              const coursesData = courses.map((course) => ({
                professor_id: course.professor_id,
                week_hours: course.week_hours,
              }));

              // Extracting only the professor_id property for each item in books, communityServices, conferences, and papers arrays
              const booksData = books.map((book) => ({
                professor_id: book.professor_id,
              }));
              const communityServicesData = communityServices.map(
                (service) => ({ professor_id: service.professor_id }),
              );
              const conferencesData = conferences.map((conference) => ({
                professor_id: conference.professor_id,
              }));
              const papersData = papers.map((paper) => ({
                professor_id: paper.professor_id,
              }));

              return {
                academic_year_id,
                books: booksData,
                communityServices: communityServicesData,
                conferences: conferencesData,
                courses: coursesData,
                papers: papersData,
              };
            });

            res.send({
              professors: professorsData,
              academic_years_data: allDataForEachYear,
            });
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while retrieving data',
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving academic years',
      });
    });
});

router.get('/statsCards', auth, async (req, res) => {
  try {
    // Fetch academic years
    const academicYears = await AcademicYear.findAll({
      attributes: ['id', 'year'],
      order: [['year', 'ASC']],
      raw: true,
    });

    // Utility function to get counts by academic year from a model and calculate total and progress
    const getCountsByAcademicYear = async (model) => {
      const counts = await model.findAll({
        attributes: ['academic_year_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        group: 'academic_year_id',
        raw: true,
      });

      let total = 0;
      let lastYearCount = 0;
      let previousYearCount = 0;
      const data = academicYears.map((year, index) => {
        const countForYear = counts.find((c) => c.academic_year_id === year.id);
        const count = countForYear ? countForYear.count : 0;
        total += count;

        // For progress calculation
        if (index === academicYears.length - 1) {
          lastYearCount = count;
        } else if (index === academicYears.length - 2) {
          previousYearCount = count;
        }

        return count;
      });

      // Calculate progress
      let progress = 0;
      if (previousYearCount > 0) {
        progress = ((lastYearCount - previousYearCount) / previousYearCount) * 100;
        progress = parseFloat(progress.toFixed(1)); // Round to 1 decimal place
      }

      return {
        labels: academicYears.map((y) => y.year), data, total, progress,
      };
    };

    // Fetching data for each category
    const papersByYear = await getCountsByAcademicYear(Paper);
    const booksByYear = await getCountsByAcademicYear(Book);
    const conferencesByYear = await getCountsByAcademicYear(Conference);
    const communitiesByYear = await getCountsByAcademicYear(Community);

    // Sending the response
    res.send({
      papersByYear,
      booksByYear,
      conferencesByYear,
      communitiesByYear,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving statistics',
    });
  }
});

// Retrieve all Data for a professor in a specific academic year
router.get('/academic_year/:academic_year_id/professor/:professor_id', auth, async (req, res) => {
  const { professor_id } = req.params;
  const { academic_year_id } = req.params;

  // Use Promise.all to run multiple queries in parallel
  Promise.all([
    Course.findAll({
      where: { academic_year_id, professor_id },
    }),
    Paper.findAll({
      where: { academic_year_id, professor_id },
    }),
    Book.findAll({
      where: { academic_year_id, professor_id },
    }),
    Conference.findAll({
      where: { academic_year_id, professor_id },
    }),
    Community.findAll({
      where: { academic_year_id, professor_id },
    }),
  ])
    .then(([courses, papers, books, conferences, communities]) => {
      const allData = {
        courses,
        papers,
        books,
        conferences,
        communities,
      };
      res.send(allData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving data',
      });
    });
});

module.exports = router;
