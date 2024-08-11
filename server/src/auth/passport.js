const passport = require('passport');
const passportJwt = require('passport-jwt');

const { ExtractJwt, Strategy: StrategyJwt } = passportJwt;

const { Professor } = require('../models');

passport.use(new StrategyJwt(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  (jwtPayload, done) => {
    Professor.findOne({ where: { id: jwtPayload.id } })
      .then((user) => done(null, user))
      .catch((err) => done(err, false));
  },
));
