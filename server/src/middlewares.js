const User = require('./models/professor');

const isAdminMiddleware = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (user && user.is_admin) {
      next();
    } else {
      res.status(403).send({
        message: 'Access denied. Admins only.',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error checking admin status.',
    });
  }
};

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, res) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
  isAdminMiddleware,
};
