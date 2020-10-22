const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("config");

const User = require("../models/User");

// Authenticated local strategy using email and password
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        // If no user exist
        if (!user) {
          return done(null, false);
        }
        // Check if password is correct
        user.comparePassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false);
          }

          return done(null, user);
        });
      } catch (err) {
        // Something went wrong with database
        return done(err);
      }
    }
  )
);

// Authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: config.get('jwtSecret')
    },
    (payload, done) => {
      User.findById(payload.sub, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        else return done(null, false);
      }).select("-password");
    }
  )
);
