const db = require("../models");
const Professors = db.professors;
const Courses = db.courses;
const Papers = db.papers;
const Books = db.books;
const Conferences = db.conferences;
const CommunityServices = db.community_services;
const AcademicYears = db.academic_years;

// Retrieve all professors data for selected academic year.
exports.findAllData = (req, res) => {
  AcademicYears.findAll()
    .then((academicYears) => {
      const academic_year_ids = academicYears.map((year) => year.id);

      Professors.findAll()
        .then((professors) => {
          const professorsData = professors;

          const promises = academic_year_ids.map((academic_year_id) =>
            Promise.all([
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
          );

          return Promise.all(promises).then((results) => {
            const allDataForEachYear = results.map((data, index) => {
              const academic_year_id = academic_year_ids[index];
              const [courses, papers, books, conferences, communityServices] =
                data;

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
                (service) => ({ professor_id: service.professor_id })
              );
              const conferencesData = conferences.map((conference) => ({
                professor_id: conference.professor_id,
              }));
              const papersData = papers.map((paper) => ({
                professor_id: paper.professor_id,
              }));

              return {
                academic_year_id: academic_year_id,
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
              err.message || "Some error occurred while retrieving data.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving academic years.",
      });
    });
};
