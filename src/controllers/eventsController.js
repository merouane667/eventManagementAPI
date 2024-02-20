const Event = require('../models/eventsModel');
const admin = require("firebase-admin");


exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
};

exports.createEvent = async (req, res) => {

    const idToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;

    try {
        if (!idToken) {
            return res.status(403).json({ error: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;

        // AUTHORIZED
        const eventData = req.body;
        try {
            const event = await Event.create(eventData);
            res.json(event);
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({ error: 'Error creating event' });
        }

    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        return res.status(403).json({ error: 'Unauthorized' });
    }


};

exports.deleteEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const idToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;

    try {
        if (!idToken) {
            return res.status(403).json({ error: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const event = await Event.findOne({ eventId });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the user is the owner of the event
        if (event.organizer !== uid) {
            return res.status(403).json({ error: 'Unauthorized: You are not the owner of this event' });
        }

        const deletedEvent = await Event.findOneAndDelete({ eventId });

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Error deleting event' });
    }
};

exports.ownedEvents = async (req, res) => {
    const idToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;

    try {
        if (!idToken) {
            return res.status(403).json({ error: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const ownedEvents = await Event.find({ organizer: uid });

        res.json(ownedEvents);
    } catch (error) {
        console.error('Error fetching owned events:', error);
        res.status(500).json({ error: 'Error fetching owned events' });
    }
};