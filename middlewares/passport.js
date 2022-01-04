const { JWT_SECRET } = require("../configs");

const passport = require("passport");

// Method
const JwtStrategy = require("passport-jwt").Strategy;

const { ExtractJwt } = require("passport-jwt");

const User = require("../models/User");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);
        //   If user is not exist
        if (!user) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
