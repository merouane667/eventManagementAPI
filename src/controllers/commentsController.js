const Comment = require('../models/commentsModel');

exports.getComments = async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const comments = await Comment.find({ event: eventId });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error fetching comments' });
    }
};

exports.createComment = async (req, res) => {
    const { eventId } = req.params;
    const { user, content, timestamp } = req.body;
    try {
        const comment = await Comment.create({ event: eventId, user, content, timestamp });
        res.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Error creating comment' });
    }
};