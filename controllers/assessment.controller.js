//initialization
const router = require('express').Router();
const bodyParser = require('body-parser');
const Assessment = require('../models/assessment.model');
const HelperMethod = require('../utils/helper.method');

/** ----------- MIDDLEWARE ------------ */
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
/** ----------- MIDDLEWARE END------------ */

/*----- DATABASE OPERATIONS ---- */

//create an assessment
router.post('/', (req, res) => {

    /** validation */
    let helper = new HelperMethod();

    //NAME VALIDATION
    let error = helper.validateName(req.body.assessment, res);
    if (error) {
        return error;
    }

    error = helper.validateQuestions(req.body.assessment, res);
    if (error) {
        return error;
    }


    /** validation END */
    let newAssessment = new Assessment(req.body.assessment);
    newAssessment.save().then((savedAssessment) => {
        return res.json({
            status: true,
            message: "Assessment Created!",
            result: savedAssessment

        });
    }).catch((e) => {
        console.log(e);
        return res.json({
            status: false,
            message: "Failed to create an assessment!",
            result: e

        });
    });

});

//get all the assessments
router.get('/', (req, res) => {
    return Assessment.find().then((assessments) => {
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
    return Assessment.find({_id: req.params.assessmentId}).then((assessment) => {
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