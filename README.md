# Faculty Evaluation System API Documentation

This is the server side API for a Faculty Evaluation System. It is built with Node.js and uses Express.js as the web framework and Sequelize ORM for handling database operations with a MySQL database. It also uses JWT for authentication and authorization.

## Setup and Installation

1. Clone the repository:

```bash
git clone https://github.com/sayjin93/faculty-evaluation-systen.git
```

2. Navigate into the project directory:

```bash
cd api
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

Edit`.env` file in the project root directory and provide values for the following variables:

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_DIALECT=mysql
API_PORT=4000
JWT_SECRET_KEY=your_jwt_secret_key
```

5. Run the server:

```bash
npm start
```

## API Structure

The API is structured around resources like academic years, books, community services, conferences, courses, papers, professors, and users.

### Directory Structure

The directory structure of the project is as follows:

```
- config/
  - authenticate.js
- controllers/
  - academic_years.controller.js
  - books.controller.js
  - community_services.controller.js
  - conferences.controller.js
  - courses.controller.js
  - papers.controller.js
  - professors.controller.js
  - users.controller.js
- models/
  - index.js
  - academic_year.model.js
  - book.model.js
  - community_service.model.js
  - conference.model.js
  - course.model.js
  - paper.model.js
  - professor.model.js
  - user.model.js
- routes/
  - academic_years.routes.js
  - books.routes.js
  - community_services.routes.js
  - conferences.routes.js
  - courses.routes.js
  - papers.routes.js
  - professors.routes.js
  - users.routes.js
- seeders/
  - users_seed.js
  -academic_year_seed.js
  -professors_seed.js
  -courses_seed.js
  -papers_seed.js
  -books_seed.js
  -conferences_seed.js
  -communities_seed.js
- .env
- server.js
```

### Models and Associations

- `AcademicYear`: Represents the academic years.
- `Book`: Represents the books authored by professors. May be associated with `Professors` and `AcademicYears`.
- `CommunityService`: Represents the community services done by professors. May be associated with `Professors` and `AcademicYears`.
- `Conference`: Represents the conferences attended by professors. May be associated with `Professors` and `AcademicYears`.
- `Course`: Represents the courses taught by professors. May be associated with `Professors` and `AcademicYears`.
- `Paper`: Represents the research papers published by professors. May be associated with `Professors` and `AcademicYears`.
- `Professor`: Represents the professors.
- `User`: Represents the system users.

## Endpoints

### Academic Years

- `GET /api/academic_years`: Get all academic years.
- `GET /api/academic_years/:id`: Get a specific academic year.
- `POST /api/academic_years`: Create a new academic year.
- `PUT /api/academic_years/:id`: Update a specific academic year.
- `DELETE /api/academic_years/:id`: Delete a specific academic year.

### Books

- `GET /api/books`: Get all books.
- `GET /api/books/:id`: Get a specific book.
- `POST /api/books`: Create a new book.
- `PUT /api/books/:id`: Update a specific book.
- `DELETE /api/books/:id`: Delete a specific book.

(Note: Replace `books` with other resources like `community_services`, `conferences`, `courses`, `papers`, `professors`, `users` to access those respective endpoints)

## License

This project is licensed under the ISC License.
