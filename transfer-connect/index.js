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
const schedule = require('node-schedule');

/* Local Module Imports */
const bankRoutes = require('./routes/bank-routes');
const programRoutes = require('./routes/program-routes');
const HttpError = require('./models/http-error');
const SFTPClient = require('./sftp/sftp');
const { sendHandbackFiles } = require('./sftp/dummy_sftp');
const checkAuth = require('./middleware/check-auth');
const { loyaltyPrograms } = require('./controllers/program-controllers');

/* Express Setup */
const app = express();
const PORT = process.env.PORT || 3002;

/* schedule sending data to SFTP in the background (currently every min at 42nd second)*/
const job_send = schedule.scheduleJob('0 * * * * *',() => SFTPClient.sendDailyTransfers(loyaltyPrograms));
const job_handback = schedule.scheduleJob('20 * * * * *',() => sendHandbackFiles(loyaltyPrograms));

const job_update = schedule.scheduleJob('40 * * * * *',() => SFTPClient.updateDailyTransfers(loyaltyPrograms));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

app.use(checkAuth);

app.use('/api/bank', bankRoutes);

app.use('/api/program', programRoutes);

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