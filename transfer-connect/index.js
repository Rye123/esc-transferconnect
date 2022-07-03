/* Environment Variables 
    Defined in a `.env` file in the same directory of this file, like this: VARIABLE_NAME=...
    These variables are accessible in Node with process.env.VARIABLE_NAME.
*/
require('dotenv').config(); 

/* Module Imports */
const express = require('express');
const morgan = require('morgan'); // Logging middleware: https://expressjs.com/en/resources/middleware/morgan.html
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* Local Module Imports */
const bankRoutes = require('./routes/bank-routes');
const HttpError = require('./models/http-error');

/* Express Setup */
const app = express();
const PORT = process.env.PORT || 3002;
const APP_NAME = "Bank Server";

app.use(bodyParser.json());

app.use('/api/bank', bankRoutes);

app.use((req, res, next) => {  //this catches the case when non existent routes are called
    throw new HttpError("Could not find this route.", 404);
})

app.use((error, req, res, next) => {  //special error checking function, when routes return error
    if (res.headerSent) {   //check if response has been sent, because can only send 1 response
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unkown error occured'});
})

const mongoDBurl = process.env.MONGODB_URI;
mongoose
    .connect(mongoDBurl)
    .then(() => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });