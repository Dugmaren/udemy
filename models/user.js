const mongoose = require('mongoose');
const { Schema } = mongoose;    // destructuring mongoose.Schema

const userSchema = new Schema({
  googleId: String
});

mongoose.model('users', userSchema);