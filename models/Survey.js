const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

// note the SUB-DOCUMENT collection (recipients)
// we use this when we want a very strong link between
// the parent, and the child. ie - the child will not be
// used in any circumstance without the parent
// ** also note - you do NOT have to import this

// Note the size record for a document (user, survey etc)
// can be 4mb at max.

// Badassery in the FK department
// the _underscore prefex is just a convention thing, not necessary
const surveySchema = new Schema({
  title: String,
  subject: String,
  body: String,
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User'},
  dateSent: Date,
  lastResponded: Date
});

mongoose.model('surveys', surveySchema);