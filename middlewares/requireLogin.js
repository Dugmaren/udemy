// note lowercase name by convention means we're exporting
// a function, not a class

// Middleware catches any request that comes in and modifies it
// so this is the one that checks if you're logged in

// Next indicates which middleware will be called after this one.
module.exports = (req, res, next) => {
  if(!req.user) {
    return res.status(401).send({ error: 'You need to be logged in to conintue.'});
  }
  // Note we only make it here and call the next middleware in
  // the chain if we had a user and didn't return above.
  next();
};