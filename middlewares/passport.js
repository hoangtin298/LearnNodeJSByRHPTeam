const { JWT_SECRET, auth } = require("../configs");

const passport = require("passport");

// Method
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");

const { ExtractJwt } = require("passport-jwt");

const User = require("../models/User");

// Passport JWT
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

// Passport local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        //   If user is not exist
        if (!user) return done(null, false);

        // Compare password with hashed password in database
        const isCorrectPassword = await user.isValidPassword(password);
        // If not correct
        if (!isCorrectPassword) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Passport google plus
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: auth.google.CLIENT_ID,
      clientSecret: auth.google.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the current user exists in our database
        const user = await User.findOne({
          authGoogleID: profile.id,
          authType: "google",
        });
        // If exist
        if (user) return done(null, user);

        // If did not exist
        // Create a new user account
        const newUser = new User({
          authType: "google",
          authGoogleID: profile.id,
          email: profile.emails[0].value,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
