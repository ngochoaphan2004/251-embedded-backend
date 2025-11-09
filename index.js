const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const EventEmitter = require('events');
// Swagger
const swagger_config = require("./config/swagger")
// Config
const logEvents = require('./logEvents');
require('dotenv').config();
// Controller
const telemetry = require("./controller/telemetry")
const login = require("./controller/login")
const realtime = require("./controller/realtime")


class Emitter extends EventEmitter {}
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const app = express();
const PORT = process.env.PORT || 3500;


// Swagger config
swagger_config(app, PORT);

// Middleware to parse JSON body 
app.use(bodyParser.json());
// Middleware storage log
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');
    next();
});

// Config route
telemetry(app);
login(app);
realtime();

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;