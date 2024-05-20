const Book = require('../models/book');
const Professor = require('../models/professor');

exports.createBook = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const bookData = {
    title: req.body.title,
    publication_house: req.body.publication_house,
    publication_year: req.body.publication_year || new Date(),
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  try {
    const data = await Book.create(bookData);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Book',
    });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const result = await Book.findAll();
    res.json(result || { message: 'Does not exist any Book' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Books',
    });
  }
};
exports.getBooksByProfessor = async (req, res) => {
  try {
    const data = await Book.findAll({
      where: { professor_id: req.params.professor_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((book) => ({
      ...book.get(),
      professor_full_name: `${book.Professor.first_name} ${book.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Books for the Professor',
    });
  }
};

exports.getBooksByYear = async (req, res) => {
  try {
    const data = await Book.findAll({
      where: { academic_year_id: req.params.academic_year_id },
      include: [{ model: Professor, attributes: ['first_name', 'last_name'] }],
    });
    const modifiedData = data.map((book) => ({
      ...book.get(),
      professor_full_name: `${book.Professor.first_name} ${book.Professor.last_name}`,
    }));
    res.send(modifiedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Books',
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const data = await Book.findByPk(req.params.id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Book with id=${req.params.id}`,
      });
    }
  } catch (err) {
    // Include an error parameter here
    res.status(500).send({
      message: `Error retrieving Book with id=${req.params.id}`,
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const num = await Book.update(req.body, { where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Book was updated successfully' });
    } else {
      res.send({
        message: `Cannot update Book with id=${req.params.id}. Maybe Book was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Book with id=${req.params.id}`,
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const num = await Book.destroy({ where: { id: req.params.id } });
    if (Number(num) === 1) {
      res.send({ message: 'Book was deleted successfully' });
    } else {
      res.send({
        message: `Cannot delete Book with id=${req.params.id}. Maybe Book was not found!`,
      });
    }
  } catch (err) {
    res.status(409).send({
      message: `Could not delete Book with id=${req.params.id}`,
    });
  }
};

exports.deleteAllBooks = async (req, res) => {
  try {
    const nums = await Book.destroy({ where: {} });
    res.send({ message: `${nums} Books were deleted successfully` });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while removing all Books',
    });
  }
};
