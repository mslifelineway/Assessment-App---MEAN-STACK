//init code
const mongoose = require('mongoose');

//schema
const AssessmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    questions: [{
        question: {
            type: String,
            required: true,
            trim: true,
        },
        isQuestionTypeBoolean: {
            type: Boolean,
            default: false,
        },
        choices: [{
            name: {
                type: String,
                required: true,
                trim: true,
            },
            isTrue: {
                type: Boolean,
                default: false,
            }

        }]

    }]

});


//CREATING THE MODEL BY SCHEMA
const AssessmentModel = mongoose.model('Assessments', AssessmentSchema);

//EXPORTING THE MODEL
module.exports = mongoose.model('Assessments');
