const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const eventsController = require('../controllers/eventsController');
const attendeesController = require('../controllers/attendeesController');
const commentsController = require('../controllers/commentsController');


// SIGN UP
router.post('/signup', authController.signup);

// LOGIN
router.post('/login', authController.login);

// Get all users
router.get('/users', authController.getAllUsers);

// Get all events
router.get('/events', eventsController.getAllEvents);

// Get owned events
router.get('/ownedEvents', eventsController.ownedEvents);

// Get attendees of a particular event
router.get('/events/:eventId/attendees', attendeesController.getAttendees);

// Get comments of a particular event
router.get('/events/:eventId/comments', commentsController.getComments);

// Create an event
router.post('/events', eventsController.createEvent);

// Invite someone to your event
router.post('/events/:eventId/invite', attendeesController.inviteAttendee);

// Delete Invitation
router.delete('/events/:eventId/attendees/:attendeeId', attendeesController.deleteInvitation);

// Delete your event
router.delete('/events/:eventId', eventsController.deleteEvent);

// Comment on any event
router.post('/events/:eventId/comments', commentsController.createComment);

module.exports = router;

