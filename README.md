# Faculty Evaluation System API Documentation

This is the server side API for a Faculty Evaluation System. It is built with Node.js and uses Express.js as the web framework and Sequelize ORM for handling database operations with a MySQL database.

## Setup and Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate into the project directory:

```bash
cd <project-directory>
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

Create a `.env` file in the project root directory and provide values for the following variables:

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_DIALECT=mysql
API_PORT=4000
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
  - academic_years_controller.js
  - books_controller.js
  - community_services_controller.js
  - conferences_controller.js
  - courses_controller.js
  - papers_controller.js
  - professors_controller.js
  - users_controller.js
- models/
  - index.js
  - academic_years_model.js
  - books_model.js
  - community_services_model.js
  - conferences_model.js
  - courses_model.js
  - papers_model.js
  - professors_model.js
  - users_model.js
- routes/
  - academic_years_routes.js
  - books_routes.js
  - community_services_routes.js
  - conferences_routes.js
  - courses_routes.js
  - papers_routes.js
  - professors_routes.js
  - users_routes.js
- seeders/
  - 20230430010919-users.js
- .env
- server.js
```

### Models and Associations

- `AcademicYears`: Represents the academic years.
- `Books`: Represents the books authored by professors. Associated with `Professors` and `AcademicYears`.
- `CommunityServices`: Represents the community services done by professors. Associated with `Professors` and `AcademicYears`.
- `Conferences`: Represents the conferences attended by professors. Associated with `Professors` and `AcademicYears`.
- `Courses`: Represents the courses taught by professors. Associated with `Professors` and `AcademicYears`.
- `Papers`: Represents the research papers published by professors. Associated with `Professors` and `AcademicYears`.
- `Professors`: Represents the professors.
- `Users`: Represents the system users.

## Endpoints

### Academic Years

- `GET /academic_years`: Get all academic years.
- `GET /academic_years/:id`: Get a specific academic year.
- `POST /academic_years`: Create a new academic year.
- `PUT /academic_years/:id`: Update a specific academic year.
- `DELETE /academic_years/:id`: Delete a specific academic year.

### Books

- `GET /books`: Get all books.
- `GET /books/:id`: Get a specific book.
- `POST /books`: Create a new book.
- `PUT /books/:id`: Update a specific book.
- `DELETE /books/:id`: Delete a specific book.

(Note: Replace `books` with other resources like `community_services`, `conferences`, `courses`, `papers`, `professors`, `users` to access those respective endpoints)

## Testing



Tests are yet to be implemented for this API.

## Contributing

To contribute to this project, please follow the [GitHub Flow](https://guides.github.com/introduction/flow/).

## License

This project is licensed under the ISC License.

Please replace `<repository-url>` and `<project-directory>` with the actual URL of your repository and the directory of your project.