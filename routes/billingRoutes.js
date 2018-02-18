// basically authRoutes.js but for billing based routes
// instead of authorization
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

// Note we're not calling requireLogin as a function() below.
// we're giving a reference to a function so it can be called
// internally

// Further note - you can call express (app.*) with as many
// functions as variables as you want, the only requirement is
// that eventually one of them handles the request and sends
// a response back to the user.
module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {

    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 moar credits',
      source: req.body.id
    });

    // Can always access the user through req.user because
    // passport.js is awesome
    req.user.credits += 5;
    // remember this is asynchronous
    // also, it's convention to have a current user as "user"
    // instead of repeatedly using req.user as it could be an
    // old version etc.
    const user = await req.user.save();
    // res.send is how you communicate your response
    res.send(user);
  });
};