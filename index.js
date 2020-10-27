//initialization
require('dotenv').config();
//connecting mongo database
require('./db_connection');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT;
const AssessmentController = require('./controllers/assessment.controller');
const UserController = require('./controllers/user.controller');
const AdminController = require('./controllers/admin.controller');
const UserAssessmentController = require('./controllers/user.assessment.controller');
/** --------- MIDDLEWARE  ------------*/
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

/** ---------- MIDDLEWARE - END--------------*/

/**----------- CONTROLLER MAPPING WITH URL---------- */

app.use('/assessments', AssessmentController);
app.use('/users', UserController);
app.use('/admin', AdminController);
app.use('/user/assessments', UserAssessmentController);

app.all('/', (req, res) => {
    return res.json({
        status: true,
        message: "Location does not found!"
    });
});
/**----------- CONTROLLER MAPPING WITH URL- END---------- */

//START THE SERVER
app.listen(port,  (req, res) => {
    console.log('server is listening on port : ' + port);
});