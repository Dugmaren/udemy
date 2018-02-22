// Cool note, status codes 400-409 means a request based error
// There are status codes in the HTTPspec if you wanna nerd out.
module.exports = (req, res, next) => {
  if(req.user.credits < 1) {
    return res.status(403).send({ error: 'You need at least 1 credit to create a survey.'});
  }
  next();
};