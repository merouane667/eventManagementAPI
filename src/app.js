const express = require('express');
const routes = require('./routes/routes');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require("firebase-admin");
const credentials = require("./eventmanagementapi-dc258-firebase-adminsdk-2cah6-e9aec50602.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const username = 'eventmanagementdb';
const password = 'OzAU88s78WvUElAjxjZ8Q5njAmaMIZxY7cjJxMGwjIUwdmtAAzdgs7fXE3UF2mLq6fc4O4JI7OBbACDbp8MbeA==';
const host = 'eventmanagementdb.mongo.cosmos.azure.com';
const port = '10255';
const database = 'eventmanagementdb';

// Connection String
const connectionString = `mongodb://${username}:${password}@${host}:${port}/${database}?ssl=true&retryWrites=false`;

// Connect to MongoDB
mongoose.connect(connectionString);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

app.use('/', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
