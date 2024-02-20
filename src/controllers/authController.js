const admin = require("firebase-admin");
const { apiKey } = require('../config');
const axios = require('axios');




exports.signup = async (req, res) => {
    const userResponse = await admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false
    });
    res.json(userResponse);
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //authenticate user using firebase rest api
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );
        const loginData = response.data;

        //retrieve the user record
        // const userRecord = await admin.auth().getUserByEmail(email);
        res.json({
            status:"success",
            msg:"User logged in successfully",
            loginData,
        });

    } catch (error) {
        console.log("Error logging in:", error);
        res.status(401).json({ error: "Invalid login credentials"});
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const listUsers = await admin.auth().listUsers();
        const users = listUsers.users.map(userRecord => ({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            phoneNumber: userRecord.phoneNumber,
            photoURL: userRecord.photoURL,
            disabled: userRecord.disabled,
            emailVerified: userRecord.emailVerified
        }));
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

