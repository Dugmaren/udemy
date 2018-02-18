// process.env.NODE_ENV is autoset to 'production'
// by the packages

// NOTE - These keys are for SERVER SIDE only!!!

if(process.env.NODE_ENV === 'production') {
    // we're in production, return prod keys
    module.exports = require('./prod');
} else {
    // we're in dev; use dev.js
    // this is 2 lines concatenated into 1.  Require includes in our
    // dev.js file, and setting it to the variable module.exports,
    // sends it out.
    module.exports = require('./dev');
}