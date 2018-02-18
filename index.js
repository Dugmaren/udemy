const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser'); // This is express middlewhere
    // so need to use the app.use() function to wire it up
const keys = require('./config/keys');
// because the passport.js file isn't exporting or returning anything,
// we can remove the const passportConfig part, and just require the
// entire file.
//const passportConfig = require('./services/passport.js');
require('./models/user');
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

const PORT = process.env.PORT || 5000; // Heroku should define the port at runtime
app.listen(PORT);
