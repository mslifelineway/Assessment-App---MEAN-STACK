//initialization
const router = require('express').Router();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');



/** ----------- MIDDLEWARE ------------ */
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
/** ----------- MIDDLEWARE END------------ */

/*----- DATABASE OPERATIONS ---- */

router.post('/', (req, res) => {
    let user = new User(req.body.user);
    console.log('user: '+ req.body.user);
    console.log('user is : ' + user.email);
    user.save().then((savedUser) => {
        return res.json({
            status: true,
            message: "User Registered!",
            result: savedUser

        });
    }).catch((e) => {
        return res.json({
            status: false,
            message: "Failed to register the user!",
            result: e

        });
    });
});

//export the router
module.exports = router;