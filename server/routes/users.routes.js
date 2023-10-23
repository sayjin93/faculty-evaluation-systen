module.exports = (app) => {
  const users = require('../controllers/users');
  const auth = require('../config/authenticate');
  const router = require('express').Router();

  // Create a new User
  router.post('/', users.create);

  // Retrieve all Users
  router.get('/', auth, users.findAll);

  // Authenticate a User
  router.post('/login', users.login);

  // Retrieve User with a specific username
  router.get('/username/:username', auth, users.findOneByUsername);

  // Retrieve a single User with id
  router.get('/:id', auth, users.findOne);

  // Update a User with id
  router.put('/:id', auth, users.update);

  // Delete a User with id
  router.delete('/:id', auth, users.delete);

  // Delete all Users
  router.delete('/', auth, users.deleteAll);

  app.use('/api/users', router);
};
