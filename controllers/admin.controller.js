//init code
const router = require('express').Router();
const Admin = require('../models/admin.model');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const HelperMethod = require('../utils/helper.method');

/** -- MIDDLEWARE -- */
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
/** -- MIDDLEWARE END */

/** -- CONTROLLER MAPPING */
//form validation
const nameEmailPasswordValidation = [
    check('name').not().isEmpty().trim(),
    check('email').isEmail().trim().normalizeEmail(),
    check('password').not().isEmpty().trim().escape(),

];

const emailAndPasswordValidation = [
    check('email').isEmail().trim().normalizeEmail(),
    check('password').not().isEmpty().trim().escape(),
];

//check not empty fields such as name, email, password etc
//form input name must be same as written inside check('') 
//escape() converts the special character into html entities like '> to &gt;'

/** FIND ALL THE admin (LATER WE CAN DELETE THIS) */
router.get('/', (req, res) => {
    return Admin.find().then((admins) => {
        return res.json({
            status: true,
            message: "Admins found!",
            result: admins
        });
    }).catch((e) => {
        return res.json({
            status: false,
            message: "Failed to fetch admins from the database!",
            result: e
        });
    });
});

//registering new admin
/**
 * Method: Post
 * url: /admin/register
 * required: Admin object like { name: " ", email: " ", password: "" }
 */
router.post('/register', nameEmailPasswordValidation,
    (req, res) => {

        let helper = new HelperMethod();
        let errors = validationResult(req);
        let amdinValidationError = helper.identifyErrors(errors, res);
        if (amdinValidationError)
            return amdinValidationError;


        let newAdmin = new Admin(req.body);
        //has password code on bcrypt
        newAdmin.password = bcrypt.hashSync(req.body.password, 10);
        //fields are not empty
        newAdmin.save().then((adminObj) => {
            return res.json({
                status: true,
                message: "Admin registered successfully!",
                result: adminObj,
            });
        }).catch((e) => {
            //error code for duplicate key is 11000, response status code for duplicate key is 409
            if (e.code == 11000) {
                message = "";
                return res.json({
                    status: false,
                    message: "Email already in use! please use another email.",
                    result: e,
                });
            }
            return res.json({
                status: false,
                message: "Failed to register an Admin!",
                result: e,
            });
        });
    });

/**
 * LOGIN 
 * Method : Post
 * required: email, password
 * Url: /admin/login
 */

router.post('/login', emailAndPasswordValidation,
    (req, res) => {

        let helper = new HelperMethod();
        let errors = validationResult(req);
        let amdinValidationError = helper.identifyErrors(errors, res);
        if (amdinValidationError)
            return amdinValidationError;

        //now find by credentials (defined in User model, this is model method)
        Admin.findByCredentials(req.body.email, req.body.password).then((user) => {
            //admin found, so simply we will return the admin but in frontend service we will store this admin data in session or local storage
            return res.json({
                status: true,
                message: "Admin logged in successfully!",
                result: user,
            });

        }).catch((e) => {
            if (e) {
                return res.json({
                    status: false,
                    message: "Oops something went wrong!",
                    result: e,
                });
            } else {
                //this means error occure but e = undefined, that means admin record not found, that means wrong credentials
                return res.json({
                    status: false,
                    message: "Wrong Credentials!",
                    result: "Admin not found!",
                });
            }
        });
    });


//exporting the router
module.exports = router;