const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser'); // This is express middlewhere
    // so need to use the app.use() function to wire it up
const keys = require('./config/keys');

// Need to include these somewhere (anywhere?) in the project
require('./models/User');
require('./models/Survey');

// because the passport.js file isn't exporting or returning anything,
// we can remove the const passportConfig part, and just require the
// entire file.
//const passportConfig = require('./services/passport.js');
require('./services/passport'); // because passport uses the user model, we need to
// require this AFTER we require the user model.

mongoose.connect(keys.mongoURI);

const app = express(); // this is the part that talks to Node, takes a request
// and sends the request to the appropriate handler.

app.use(bodyParser.json());


// must be after app?
// uses cookiesession to do this.. age is in milliseconds (set to 30 days)
// keys array allows us to use multiple keys, picking anyone from an array
// just for more security
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
// Middlewares
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app); // call the authRoutes file with a variable
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// In production, we only have
//  1. server API
//  2. assets (main.js, main.css)
//  3. index.html (which catches everything else)
//
// But production doesn't know any of the paths really, so if the
// browser isn't asking for a specific asset, or a server API call
// then we want to send back index.html
if(process.env.NODE_ENV === 'production') {
  // #2 - find assets
  // Express will serve up production assets like main.js / main.css
  // so if we can't find this on the server, try looking in client/build
  // first, this is where the assets are stored.
  app.use(express.static('client/build'));

  // #3 - haven't found it yet, send index.html for
  //      all other ('*') requests
  // Return index.html if you can't find the right file/path.
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000; // Heroku should define the port at runtime
app.listen(PORT);
