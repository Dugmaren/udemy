const passport = require('passport'); // this is the NPM, not the passport.js file

module.exports = app => {
  /*
app.get('/', (req, res) => {    // this is the route handler for address '/'
    res.send({it: 'things to do' });   // req & res are JS objects
});
*/
  // NOTE: the 'google' variable sent to passport.authenticate is hard coded
  // to tell passport.use to use the google version of authenticate.
  // in scope: we could list other things to access from Google
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) =>  {
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    //res.send(req.user);
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
