const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false }
});

// note we export it because it's not a new document
// it's a part of another one.
module.exports = recipientSchema;
