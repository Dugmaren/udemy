const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys.js');
const app = express();  // this is the part that talks to Node, takes a request
                        // and sends the request to the appropriate handler.

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}, (accessToken) => {
    console.log(accessToken);
}));

/*
app.get('/', (req, res) => {    // this is the route handler for address '/'
    res.send({it: 'things to do' });   // req & res are JS objects
});
*/
// NOTE: the 'google' variable sent to passport.authenticate is hard coded
// to tell passport.use to use the google version of authenticate.
// in scope: we could list other things to access from Google
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

const PORT = process.env.PORT || 5000;  // Heroku should define the port at runtime
app.listen(PORT);