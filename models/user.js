const mongoose = require('mongoose');
const {Schema} = mongoose; // destructuring mongoose.Schema

// Note how to make a default value (for credits)
const userSchema = new Schema({
  googleId: String,
  credits: {type: Number, default: 0}
});

mongoose.model('users', userSchema);
