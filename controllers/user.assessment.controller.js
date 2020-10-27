//initialization
const router = require('express').Router();
const bodyParser = require('body-parser');
const UserAssessment = require('../models/user.assessment.model');
const HelperMethod = require('../utils/helper.method');

/** ----------- MIDDLEWARE ------------ */
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
/** ----------- MIDDLEWARE END------------ */

/*----- DATABASE OPERATIONS ---- */

//create an assessment
router.post('/', (req, res) => {

    //TODO: VALIDATION 
    let newUserAssessment = new UserAssessment(req.body);

    //before saving the data let's find out the email already exists or not, if exist update or else save
    // console.log('req.body.email: ' + req.body.email)
    return newUserAssessment.save().then((savedAssessment) => {
        return res.json({
            status: true,
            message: "User assessment saved!",
            result: savedAssessment

        });
    }).catch((e) => {
        console.log(e);
        return res.json({
            status: false,
            message: "Failed to save an assessment!",
            result: e

        });
    });

});

//get all the assessments
router.get('/:email', (req, res) => {
    return UserAssessment.find({ email: req.params.email }).then((assessments) => {
        return res.json({
            status: true,
            message: "Assessments Found!",
            result: assessments,
        });
    }).catch((e) => {
        return res.json({
            status: false,
            message: "Assessments Couldn't Found!",
            result: e,
        });
    });
});

//get  assessment  by id
router.get('/:assessmentId', (req, res) => {
    return UserAssessment.find({ _id: req.params.userAssessmentId }).then((assessment) => {
        return res.json({
            status: true,
            message: "Assessment Found!",
            result: assessment,
        });
    }).catch((e) => {
        return res.json({
            status: false,
            message: "Assessment Couldn't Found!",
            result: e,
        });
    });
});


//EXPORTING THE ROUTER
module.exports = router;