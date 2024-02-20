const mongoose = require('mongoose');

const attendeesSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Attendee = mongoose.model('Attendee', attendeesSchema);

module.exports = Attendee;