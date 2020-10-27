const e = require("express");

class HelperMethod {

     // identifying errors in data received from request
     identifyErrors(errors, res) {
        //check validation errors
        if (!errors.isEmpty()) {
            let errorParam = errors.array()[0].param;
            return res.json({
                status: false,
                message: " Invalid/Missing " + errorParam + " !",
                errors: errors.array()
            });
        }
    }

    /**---- ASSESSMENT FORM VALIDATION -------- */
    //assessment name validation
    validateName(assessment, res) {

        if (assessment) {
            let name = assessment.name;
            if (!name) {
                return res.json({
                    status: false,
                    message: "Please provide an assessment name!",
                });
            }
        }
    }

    //Questions[] object validation
    validateQuestions(assessment, res) {
        console.log('assessment: ' + JSON.stringify({ assessment }));
        if (assessment) {
            if (assessment.questions) {
                let questions = assessment.questions;
                console.log('questions: ' + JSON.stringify({ questions }));
                console.log('length: ' + questions.length);
                if (questions.length == 0) {
                    return res.json({
                        status: false,
                        message: "An assessment must contains atleast one Question!",
                    });
                } else {
                    let questionCounter = 0;
                    //iterate over the loop
                    for (let q of questions) {
                        ++questionCounter;
                        console.log('\n\nsingle question: ' + JSON.stringify({ q }));
                        console.log('\n\nquestion is : ' + q.question);
                        //check for question title
                        if (!q.question) {

                            console.log('question is null');
                            return res.json({
                                status: false,
                                message: "Question " + questionCounter + " should not be null",
                            });
                        } else if (q.question) {
                            console.log('question is not null: ' + q.question);
                            console.log('is booolean : ' + q.isQuestionTypeBoolean);
                            //now checking whether the questionType is boolean or not
                            if (q.isQuestionTypeBoolean) {
                                console.log('boolean quetion type....');
                                //question type is boolean
                                let choiceCounter = 0;
                                //get the choice object of index which is for boolean question type
                                let choice = q.choices[0];
                                //now replace choices of the question since it contains extra 3-choices, since choices are 4
                                //if choice answer is true then we set choice name as true or else false
                                if (choice.isTrue)
                                    choice.name = "True";
                                else
                                    choice.name = "False";
                                q.choices = [choice];
                                let choices = q.choices;
                                console.log('boolean question choices : ' + JSON.stringify({ choices }));
                            }
                            else {
                                console.log('\n\nquetion type is not boolean....');
                                //question type is not the boolean
                                let choiceCounter = 0;
                                for (let c of q.choices) {
                                    ++choiceCounter;
                                    if (!c.name) {
                                        console.log('choice is null');
                                        return res.json({
                                            status: false,
                                            message: "Choice " + choiceCounter + " of question " + questionCounter + " should not be null",
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**---- ASSESSMENT FORM VALIDATION - END-------- */
}


//exporting
module.exports = HelperMethod;
