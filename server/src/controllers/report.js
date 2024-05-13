const Sequelize = require('sequelize');

const AcademicYear = require('../models/academicYear');
const Book = require('../models/book');
const Community = require('../models/community');
const Conference = require('../models/conference');
const Course = require('../models/course');
const Paper = require('../models/paper');
const Professor = require('../models/professor');

exports.getStats = async (req, res) => {
  try {
    // Find the active academic year
    const activeYear = await AcademicYear.findOne({ where: { active: true } });
    if (!activeYear) {
      return res.status(404).send({ message: 'Active academic year not found' });
    }
    const academic_year_id = activeYear.id;

    // Aggregate data for the active academic year
    const coursesCount = await Course.count({ where: { academic_year_id } });
    const papersCount = await Paper.count({ where: { academic_year_id } });
    const booksCount = await Book.count({ where: { academic_year_id } });
    const conferencesCount = await Conference.count({ where: { academic_year_id } });
    const communityServicesCount = await Community.count({ where: { academic_year_id } });

    // Count professors based on specified criteria
    const activeProfessorsCount = await Professor.count({
      where: { is_verified: true, is_deleted: false, is_admin: false },
    });
    const allProfessorsCount = await Professor.count({
      where: { is_verified: true, is_admin: false },
    });

    // Send the aggregated data
    res.send({
      active_academic_year: activeYear.year,
      courses_count: coursesCount,
      papers_count: papersCount,
      books_count: booksCount,
      conferences_count: conferencesCount,
      community_services_count: communityServicesCount,
      active_professors_count: activeProfessorsCount,
      all_professors_count: allProfessorsCount,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving statistics',
    });
  }
};

exports.getStatsCards = async (req, res) => {
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
};

exports.getProfessorsData = async (req, res) => {
  try {
    // Find the active academic year
    const activeYear = await AcademicYear.findOne({ where: { active: true } });
    if (!activeYear) {
      return res.status(404).send({ message: 'Active academic year not found' });
    }
    const academic_year_id = activeYear.id;

    // Get all professors who are not admins and not deleted
    const professors = await Professor.findAll({
      where: {
        is_deleted: false,
        is_admin: false, // Exclude professors who are admins
      },
    });

    // Map each professor to their data
    const professorsData = await Promise.all(professors.map(async (professor) => {
      const coursesCount = await Course.count({ where: { academic_year_id, professor_id: professor.id } });
      const papersCount = await Paper.count({ where: { academic_year_id, professor_id: professor.id } });
      const booksCount = await Book.count({ where: { academic_year_id, professor_id: professor.id } });
      const conferencesCount = await Conference.count({ where: { academic_year_id, professor_id: professor.id } });
      const communityServicesCount = await Community.count({ where: { academic_year_id, professor_id: professor.id } });

      // Calculate total week hours and default to 0 if null
      const totalWeekHours = (await Course.sum('week_hours', { where: { academic_year_id, professor_id: professor.id } })) || 0;

      return {
        id: professor.id,
        professor: `${professor.first_name} ${professor.last_name}`,
        courses: coursesCount,
        papers: papersCount,
        books: booksCount,
        conferences: conferencesCount,
        community_service: communityServicesCount,
        total_week_hours: totalWeekHours,
      };
    }));

    res.send(professorsData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving professors data',
    });
  }
};

exports.getProfessorDataByYear = async (req, res) => {
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
};
