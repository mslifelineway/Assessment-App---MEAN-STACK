//init code
const e = require('express');
const mongoose = require('mongoose');

//schema
const UserAssessmentSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },

    userAssessment: [{

        _id: {
            type: String,
            required: true,
            trim: true,
        },
        scored: {
            type: Number,
            default: 0,
        },

        attempted: {
            type: Number,
            default: 0,
        },

        wrong: {
            type: Number,
            default: 0,
        },
        answered: [{
            questionId: {
                type: String,
                required: true,
                trim: true,
            },
            choices: [{
                choiceId: {
                    type: String,
                    required: true,
                    trim: true,
                },
            }]

        }],

        assessmentedOn: {
            type: Date,
            default: Date.now()
        }
    }]


});

/* MODEL METHODS (static methods) */

//find by credentials
UserAssessmentSchema.statics.findByEmail = function (email) {
    console.log('finding existing user....')
    let User = this;
    return User.findOne({ email });
}



//CREATING THE MODEL BY SCHEMA
const UserAssessmentSchemaModel = mongoose.model('UserAssessments', UserAssessmentSchema);

//EXPORTING THE MODEL
module.exports = mongoose.model('UserAssessments');
