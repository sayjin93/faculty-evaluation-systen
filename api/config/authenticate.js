const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
 const token = req.header('auth-token');
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
        status: 'fail',
        message: 'Unauthorized!',
      });
  }
};