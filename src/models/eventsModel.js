const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model('Event', eventsSchema);

module.exports = Event;