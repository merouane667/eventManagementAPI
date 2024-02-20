const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;