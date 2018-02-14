const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys.js');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id); // note this is the mongo DB collection item ID, NOT the google id
  // user.id is hardcoded to mean the mondo model's ID
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({googleId: profile.id}).then(existingUser => {
        if (existingUser) {
          // we already have a record with the given profile ID
          done(null, existingUser); // 1st arguement = error
        } else {
          // console.log('profile:', profile);
          new User({googleId: profile.id})
            .save() // because mongoose has all the functionality in there.. sheesh
            .then(user => done(null, user)); // async call promise - cuz want to make sure save completes
          // by convention we use the user in the promise in case changes were made while
          // it was saving.  but it represents the same user as the new User above
        }
      });
    }
  )
);
