const Attendee = require('../models/attendeesModel');
const Event = require('../models/eventsModel');
const admin = require("firebase-admin");

exports.getAttendees = async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const attendees = await Attendee.find({ event: eventId });
        res.json(attendees);
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).json({ error: 'Error fetching attendees' });
    }
};

exports.inviteAttendee = async (req, res) => {
    const idToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;
    const { eventId } = req.params;
    const { user, status } = req.body;
    try {
        if (!idToken) {
            return res.status(403).json({ error: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        const uid = decodedToken.uid;


        const event = await Event.findOne({ eventId });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Check if the user is the owner of the event
        console.log(uid);
        if (event.organizer !== uid) {
            return res.status(403).json({ error: 'Unauthorized: You are not the owner of this event' });
        }

        // AUTHORIZED
        try {
            const attendee = await Attendee.create({ event: eventId, user, status });
            res.json(attendee);
        } catch (error) {
            console.error('Error inviting attendee:', error);
            res.status(500).json({ error: 'Error inviting attendee' });
        }

    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        return res.status(403).json({ error: 'Unauthorized' });
    }

};

exports.deleteInvitation = async (req, res) => {
    const { eventId, attendeeId } = req.params;
    const idToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;
    const { user, status } = req.body;
    try {
        if (!idToken) {
            return res.status(403).json({ error: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        const uid = decodedToken.uid;


        const event = await Event.findOne({ eventId });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Check if the user is the owner of the event
        console.log(uid);
        if (event.organizer !== uid) {
            return res.status(403).json({ error: 'Unauthorized: You are not the owner of this event' });
        }

        // AUTHORIZED
        
        try {
            // Check if the attendee exists
            const attendee = await Attendee.findOne({ event: eventId, user: attendeeId });
            if (!attendee) {
                return res.status(404).json({ error: 'Attendee not found' });
            }

            // Delete the attendee
            await Attendee.findOneAndDelete({ event: eventId, user: attendeeId });

            res.json({ message: 'Invitation deleted successfully' });
        } catch (error) {
            console.error('Error deleting invitation:', error);
            res.status(500).json({ error: 'Error deleting invitation' });
        }

    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        return res.status(403).json({ error: 'Unauthorized' });
    }
};