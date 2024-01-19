const passport = require('passport');
const passportJwt = require('passport-jwt');

const { ExtractJwt } = passportJwt;
const StrategyJwt = passportJwt.Strategy;

const Professors = require('../models/professor');

passport.use(new StrategyJwt(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  ((jwtPayload, done) => Professors.findOne({ where: { id: jwtPayload.id } })
    .then((user) => done(null, user))
    .catch((err) => done(err))),
));
