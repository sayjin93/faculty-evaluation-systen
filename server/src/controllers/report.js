const Sequelize = require('sequelize');

const {
  AcademicYear, Book, Community, Conference, Course, Paper, Professor, Department, Faculty,
} = require('../models');

exports.getStats = async (req, res) => {
  try {
    // Find the active academic year
    const activeYear = await AcademicYear.findOne({ where: { active: true } });
    if (!activeYear) {
      return res.status(404).send({ message: 'Active academic year not found' });
    }
    const academic_year_id = activeYear.id;

    // Aggregate data for the active academic year
    const [coursesCount, papersCount, booksCount, conferencesCount, communityServicesCount] = await Promise.all([
      Course.count({ where: { academic_year_id } }),
      Paper.count({ where: { academic_year_id } }),
      Book.count({ where: { academic_year_id } }),
      Conference.count({ where: { academic_year_id } }),
      Community.count({ where: { academic_year_id } }),
    ]);

    // Send the aggregated data
    res.send({
      active_academic_year: activeYear.year,
      courses_count: coursesCount,
      papers_count: papersCount,
      books_count: booksCount,
      conferences_count: conferencesCount,
      community_services_count: communityServicesCount,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving statistics',
    });
  }
};
exports.getProfessorStats = async (req, res) => {
  try {
    const { professor_id } = req.params;

    // Find the active academic year
    const activeYear = await AcademicYear.findOne({ where: { active: true } });
    if (!activeYear) {
      return res.status(404).send({ message: 'Active academic year not found' });
    }
    const academic_year_id = activeYear.id;

    // Aggregate data for the active academic year for the specified professor
    const [coursesCount, papersCount, booksCount, conferencesCount, communityServicesCount] = await Promise.all([
      Course.count({ where: { academic_year_id, professor_id } }),
      Paper.count({ where: { academic_year_id, professor_id } }),
      Book.count({ where: { academic_year_id, professor_id } }),
      Conference.count({ where: { academic_year_id, professor_id } }),
      Community.count({ where: { academic_year_id, professor_id } }),
    ]);

    // Send the aggregated data
    res.send({
      active_academic_year: activeYear.year,
      courses_count: coursesCount,
      papers_count: papersCount,
      books_count: booksCount,
      conferences_count: conferencesCount,
      community_services_count: communityServicesCount,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving statistics',
    });
  }
};

exports.getBigStats = async (req, res) => {
  try {
    // Aggregate data for course counts based on program
    const [masterCoursesCount, bachelorCoursesCount, totalCoursesCount] = await Promise.all([
      Course.count({ where: { program: 'Master' } }),
      Course.count({ where: { program: 'Bachelor' } }),
      Course.count(),
    ]);

    // Aggregate data for professor counts based on gender, excluding admins
    const [maleProfessorsCount, femaleProfessorsCount, totalProfessorsCount] = await Promise.all([
      Professor.count({ where: { gender: 'm', is_admin: false } }),
      Professor.count({ where: { gender: 'f', is_admin: false } }),
      Professor.count({ where: { is_admin: false } }),
    ]);

    // Send the aggregated data
    res.send({
      master_courses_count: masterCoursesCount,
      bachelor_courses_count: bachelorCoursesCount,
      total_courses_count: totalCoursesCount,
      male_professors_count: maleProfessorsCount,
      female_professors_count: femaleProfessorsCount,
      total_professors_count: totalProfessorsCount,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving big statistics',
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
      } else if (previousYearCount === 0 && lastYearCount > 0) {
        progress = 100; // If previous year count is 0 and current year count is greater than 0, show 100% increment
      }
      progress = parseFloat(progress.toFixed(1)); // Round to 1 decimal place

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
exports.getProfessorStatsCards = async (req, res) => {
  try {
    const { professor_id } = req.params;

    // Fetch academic years
    const academicYears = await AcademicYear.findAll({
      attributes: ['id', 'year'],
      order: [['year', 'ASC']],
      raw: true,
    });

    // Utility function to get counts by academic year from a model for a specific professor
    const getCountsByAcademicYear = async (model) => {
      const counts = await model.findAll({
        attributes: ['academic_year_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        where: { professor_id },
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
      } else if (previousYearCount === 0 && lastYearCount > 0) {
        progress = 100; // If previous year count is 0 and current year count is greater than 0, show 100% increment
      }
      progress = parseFloat(progress.toFixed(1)); // Round to 1 decimal place

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
        is_admin: false, // Exclude professors who are admins
      },
    });

    // Map each professor to their data
    const professorsData = await Promise.all(professors.map(async (professor) => {
      const [coursesCount, papersCount, booksCount, conferencesCount, communityServicesCount, totalWeekHours] = await Promise.all([
        Course.count({ where: { academic_year_id, professor_id: professor.id } }),
        Paper.count({ where: { academic_year_id, professor_id: professor.id } }),
        Book.count({ where: { academic_year_id, professor_id: professor.id } }),
        Conference.count({ where: { academic_year_id, professor_id: professor.id } }),
        Community.count({ where: { academic_year_id, professor_id: professor.id } }),
        Course.sum('week_hours', { where: { academic_year_id, professor_id: professor.id } }),
      ]);

      return {
        id: professor.id,
        professor: `${professor.first_name} ${professor.last_name}`,
        courses: coursesCount,
        papers: papersCount,
        books: booksCount,
        conferences: conferencesCount,
        community_service: communityServicesCount,
        total_week_hours: totalWeekHours || 0,
      };
    }));

    res.send(professorsData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving professors data',
    });
  }
};
exports.getProfessorData = async (req, res) => {
  try {
    const { professor_id } = req.params;

    // Fetch academic years
    const academicYears = await AcademicYear.findAll({
      attributes: ['id', 'year'],
      order: [['year', 'DESC']], // Order by newest to oldest
      raw: true,
    });

    // Function to get counts by academic year for a specific professor
    const getCountsByAcademicYear = async (model, academicYearId) => {
      const count = await model.count({
        where: {
          academic_year_id: academicYearId,
          professor_id,
        },
      });
      return count;
    };

    // Gather stats for each academic year
    const statsByYear = await Promise.all(academicYears.map(async (year) => {
      const [books, communities, conferences, courses, papers] = await Promise.all([
        getCountsByAcademicYear(Book, year.id),
        getCountsByAcademicYear(Community, year.id),
        getCountsByAcademicYear(Conference, year.id),
        getCountsByAcademicYear(Course, year.id),
        getCountsByAcademicYear(Paper, year.id),
      ]);

      return {
        id: year.id,
        year: year.year,
        books,
        communities,
        conferences,
        courses,
        papers,
      };
    }));

    // Send the response
    res.send(statsByYear);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving statistics',
    });
  }
};

// reports page
exports.getProfessorActivityByAcademicYear = async (req, res) => {
  try {
    const { professor_id, academic_year_id } = req.params;

    const [courses, papers, books, conferences, communities] = await Promise.all([
      Course.findAll({ where: { academic_year_id, professor_id } }),
      Paper.findAll({ where: { academic_year_id, professor_id } }),
      Book.findAll({ where: { academic_year_id, professor_id } }),
      Conference.findAll({ where: { academic_year_id, professor_id } }),
      Community.findAll({ where: { academic_year_id, professor_id } }),
    ]);

    res.send({
      courses, papers, books, conferences, communities,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving data',
    });
  }
};
exports.getDepartmentWiseDistribution = async (req, res) => {
  try {
    const { academic_year_id, faculty_id } = req.params;

    // Validate the academic year and faculty
    const [selectedYear, selectedFaculty] = await Promise.all([
      AcademicYear.findByPk(academic_year_id),
      Faculty.findByPk(faculty_id),
    ]);

    if (!selectedYear) {
      return res.status(404).send({ message: 'Selected academic year not found' });
    }

    if (!selectedFaculty) {
      return res.status(404).send({ message: 'Selected faculty not found' });
    }

    // Get all departments within the selected faculty
    const departments = await Department.findAll({ where: { faculty_id } });

    // Map each department to its aggregated data
    const departmentData = await Promise.all(departments.map(async (department) => {
      const professors = await Professor.findAll({ where: { department_id: department.id } });
      const professorIds = professors.map((professor) => professor.id);

      const [coursesCount, papersCount, booksCount, conferencesCount, communityServicesCount] = await Promise.all([
        Course.count({ where: { academic_year_id, professor_id: professorIds } }),
        Paper.count({ where: { academic_year_id, professor_id: professorIds } }),
        Book.count({ where: { academic_year_id, professor_id: professorIds } }),
        Conference.count({ where: { academic_year_id, professor_id: professorIds } }),
        Community.count({ where: { academic_year_id, professor_id: professorIds } }),
      ]);

      return {
        department: department.key,
        courses: coursesCount,
        papers: papersCount,
        books: booksCount,
        conferences: conferencesCount,
        communityServices: communityServicesCount,
      };
    }));

    // Send the aggregated data
    res.send(departmentData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving department-wise distribution',
    });
  }
};
exports.getCourseLoadAnalysis = async (req, res) => {
  try {
    // Extract the academic year ID from the request parameters
    const { academicYearId } = req.params;

    // Fetch the academic year to ensure it exists
    const academicYear = await AcademicYear.findByPk(academicYearId);
    if (!academicYear) {
      return res.status(404).json({ error: 'Academic year not found' });
    }

    // Fetch all professors with their courses for the specified academic year
    const professors = await Professor.findAll({
      include: [{
        model: Course,
        where: { academic_year_id: academicYearId },
        attributes: ['name', 'week_hours', 'program'],
      }],
    });

    // Prepare data for course load analysis
    const courseLoadData = professors.map((professor) => {
      const totalCourses = professor.Courses.length;
      const totalWeekHours = professor.Courses.reduce((sum, course) => sum + course.week_hours, 0);
      const bachelorCourses = professor.Courses.filter((course) => course.program === 'Bachelor').length;
      const masterCourses = professor.Courses.filter((course) => course.program === 'Master').length;

      return {
        professor: `${professor.first_name} ${professor.last_name}`,
        courses: totalCourses,
        weekHours: totalWeekHours,
        bachelorCourses,
        masterCourses,
      };
    });

    res.status(200).json(courseLoadData);
  } catch (error) {
    console.error('Error fetching course load analysis:', error);
    res.status(500).json({ error: 'An error occurred while fetching course load analysis.' });
  }
};
