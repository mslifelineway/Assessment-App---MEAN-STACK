import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AnsweredAssessment } from 'src/app/models/answered-assessment';
import { Assessment } from 'src/app/models/assessment.model';
import { Question } from 'src/app/models/question.model';
import { SelectedChoice } from 'src/app/models/selected-choice.model';
import { UserAssessment } from 'src/app/models/user.assessment';
import { AssessmentService } from 'src/app/services/assessment.service';
import { UserAssessmentService } from 'src/app/services/user-assessment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  //timer
  timeLeft: string;
  minute: number = 10;
  second: number = 0;
  interval;
  isTimerStarted: Boolean = false;
  //user credentials
  score: Number = 0;
  attempt: Number = 0;
  correct: Number = 0;
  errorInfo: string;
  email: string;
  assessmentId: string;
  assessment = new Assessment();
  questionIndex: number = 0;
  error: string;
  question = new Question();
  userAssessment = new UserAssessment();
  //step: 6; will be updated whenever next or previous button clicked or question will be updated
  answeredAssessmentArray = [];
  //step: 8; global object of answeredAssessment();
  // answeredAssessment = new AnsweredAssessment();
  //step: 9; create a global object of selectedChoiceArray to store all the selected choices
  selectedChoiceArray = [];



  constructor(private router: Router, private route: ActivatedRoute, private assessmentService: AssessmentService, private userAssessmentService: UserAssessmentService) {
    this.setTimeLeft();
  }

  ngOnInit(): void {
    //step:1 ; verify user and get the assessmentId
    this.verifyUser();//this will set the email and assessmentId from params
    this.startTimer();
    //1. get the assessment by id, method of getting data from database is asynchronous method
    this.getAssessmentById();
  }

  //step:1 
  verifyUser() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.email && params.assessmentId) {
          this.email = params.email;
          this.assessmentId = params.assessmentId;
        } else {
          this.email = undefined;
          this.assessmentId = undefined;
          //navigate back to come with previous required details
          this.navigateToBack();
        }
      }
    )
  }

  //redirect or navigate back
  navigateToBack() {
    //navigate back to come with previous required details
    this.router.navigate['home'];
  }

  //step:1; get the assessment by id
  getAssessmentById() {
    if (this.assessmentId) {
      this.assessmentService.getAssessmentById(this.assessmentId).subscribe((response: any) => {

        if (response) {
          if (response.status) {
            this.assessment = response.result[0];
            //3. initializing the required variables, arrays, objects etc
            this.initializeDefaultValues();
          } else {
            this.error = "Assessment could not exists!";
            this.assessment = new Assessment();
          }
        } else {
          this.error = "Something went wrong! please try again...";
          this.assessment = new Assessment();
        }
      });
    }
  }

  //step: 3
  initializeDefaultValues() {
    //step: 4: store the question of 0th index of assessment
    this.updateQuestion();
    this.setAllChoicesOfQuestionFalse();
    //5. set the assessmentId to the userAssessment() global object
    this.setAssessmentIdToUserAssessment();
    //7: set assessmentArray to userAssessment.asnwered
    this.setAnsweredAssessmentArrayToUserAnswered();
  }

  //step: 4; update question 
  updateQuestion() {
    this.question = this.assessment.questions[this.questionIndex];
    //after updating the questions, let's get the selectedChoices from the answeredAssessment() by questionId
    this.getSelectedChoiceArrayFromAnsweredAssessmentArray();
    // console.log('\n\nselected questions array ....' + JSON.stringify(this.selectedChoiceArray))
  }

  getSelectedChoiceArrayFromAnsweredAssessmentArray() {

    /**
     * Note: Since, we have updated the question by changing the questionIndex and question Ojbect and since question contains the correct answer 
     * by default so we need to set all the options false;
     */
    this.setAllChoicesOfQuestionFalse();

    /**
     * Note: Since, we have set false to all the choices of the updated question and since selectedChoicesArray[] of each 
     * question has stored in the answeredAssessmentArray[]. so we need to check whether the current updated question was selected 
     * before or not. if it was already selected or answered then all the choices of this question i.e. selectedChoiceArray[] 
     * also had stored in the answeredAssessmentArray[]. so we need to get back and then we will store in the selectedChoiceArray[]
     * for the current updated question. and after that we will match the choiceId of selectedChoiceArray[] in 
     * question.choices (which already store all the choiceId but with false value bcoz we set them false by above method setAllChoicesOfQuestionFalse())
     * we will match the choiceId and we will set the 'isTrue' value of matched choice in question.choices.
     * since, in html we have binded by question.choices. so it will perform to checked if it was checked.
     * 
     */
    this.selectedChoiceArray = [];
    this.answeredAssessmentArray.forEach((answeredAssessment) => {
      if (answeredAssessment) {
        if (answeredAssessment.questionId === this.question._id) {
          this.selectedChoiceArray = answeredAssessment.chioces;
          this.selectedChoiceArray = answeredAssessment.choices;
          // console.log('was answered already....' + JSON.stringify(this.selectedChoiceArray))
          for (let choice of this.selectedChoiceArray) {
            this.question.choices.forEach((qChoice) => {
              if (qChoice._id === choice.choiceId) {
                qChoice.isTrue = true;
              }
            })
          }
        }
      }
    });

    // let answeredAssessment = this.answeredAssessmentArray.find(answeredAssessment => answeredAssessment.questionId === this.question._id);
    // if (answeredAssessment) {

    //   this.selectedChoiceArray = answeredAssessment.choices;
    //   console.log('was answered already....' + JSON.stringify(this.selectedChoiceArray))
    //   for(let choice of this.selectedChoiceArray) {
    //     this.question.choices.forEach((qChoice) => {
    //       if(qChoice._id === choice.choiceId) {
    //         qChoice.isTrue = true;
    //       }
    //     })
    //   }
    //   console.log('was answered already after....' + JSON.stringify(this.selectedChoiceArray))

    // } else {
    //   console.log('was not answered before....')
    //   this.selectedChoiceArray = [];
    // }
  }


  //step: 5
  setAssessmentIdToUserAssessment() {
    this.userAssessment._id = this.assessment._id;
  }

  //step: 7: store the answeredAssessmentArray to the userAssessment.answered
  setAnsweredAssessmentArrayToUserAnswered() {
    this.userAssessment.answered = this.answeredAssessmentArray;
  }

  //step: 10; store the selectedChoice() object to the selectedChoiceArray[]
  setSelectedChioceToSelectedChoiceArray(selectedChoice: SelectedChoice) {
    this.selectedChoiceArray.push(selectedChoice);
  }

  //step: 11; store the questionId and selectedChoiceArray[] to the answeredAssessmentObject
  setQuestionIdAndSelectedChoiceArrayToAnsweredAssessment() {
    // this.answeredAssessment.questionId = this.question._id;
    // this.answeredAssessment.choices = this.selectedChoiceArray;
    // //before pushing this object let's check whether it already exists in this array or not
    // if (this.isAnsweredAssessmentExistsInAnsweredAssessmentArray()) {
    //   //if existed, then remove this object by questionId and store this new assessment bcoz the choices may be changed so we need to update by new object of answeredAssessment()
    //   this.removeAnsweredAssessmentFromAnsweredAssessmentArray();
    // }
    // this.answeredAssessmentArray.push(this.answeredAssessment);
    // this.answeredAssessment = new AnsweredAssessment();
    // this.selectedChoiceArray = [];//clear the selected choice array after storing

    let answeredAssessment = new AnsweredAssessment();
    answeredAssessment.questionId = this.question._id;
    answeredAssessment.choices = this.selectedChoiceArray;
    //before pushing this object let's check whether it already exists in this array or not
    if (this.isAnsweredAssessmentExistsInAnsweredAssessmentArray(answeredAssessment)) {
      //if existed, then remove this object by questionId and store this new assessment bcoz the choices may be changed so we need to update by new object of answeredAssessment()
      this.removeAnsweredAssessmentFromAnsweredAssessmentArray(answeredAssessment);
    }
    this.answeredAssessmentArray.push(answeredAssessment);
    answeredAssessment = new AnsweredAssessment();
    // this.selectedChoiceArray = [];//clear the selected choice array after storing

    // console.log('\n\n after saving the data to answeredAssessmentArray: ' + JSON.stringify(this.answeredAssessmentArray))
  }

  //check whether answeredAssessment() object exists in answeredAssessmentArray[] by comparing questionId
  isAnsweredAssessmentExistsInAnsweredAssessmentArray(answeredAssessment: AnsweredAssessment) {
    let status = false;
    this.answeredAssessmentArray.forEach((answeredAssessment1) => {
      if (answeredAssessment1) {
        if (answeredAssessment1.questionId === answeredAssessment.questionId)
          status = true;
      }
    });
    return status;
    // let existence = this.answeredAssessmentArray.find(answeredAssessment1 => answeredAssessment1.questionId === this.answeredAssessment.questionId);
    // if (existence) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  ///update the answeredAssessmentArray by not existing answeredAssessment() object in answeredAssessmentArray[]
  removeAnsweredAssessmentFromAnsweredAssessmentArray(answeredAssessment: AnsweredAssessment) {
    this.answeredAssessmentArray = this.answeredAssessmentArray.filter(answeredAssessment1 => answeredAssessment1.questionId !== answeredAssessment.questionId);
  }

  /** ------ OTHER ACTIONS--------- */
  //step: 13; create checkboxChangedMethod();

  /**
    * LOGIC FOR CHECKED: 
    * IF selectedChioce object EXISTS IN selectedChoiceArray THEN KEEP AS IT IS.
    * OR ELSE STORE THE selectedChioce object IN THE selectedChoiceArray.
    * 
    * LOGIC FOR UNCHECKED:
    * IF selectedChioce object NOT EXISTS IN selectedChoiceArray THEN KEEP AS IT IS.
    * OR ELSE REMOVE THE selectedChioce object FROM THE selectedChoiceArray.
    */
  checkboxChanged(event, choiceId) {
    console.log('check box changed....' + choiceId)
    console.log('event : ' + event)
    //step: 13.1: 
    let selectedChoice = new SelectedChoice();
    selectedChoice.choiceId = choiceId;
    // 13.2: check for checkbox checked
    if (event.target.checked) {
      //if choice is checked and not existed then store it or else no job to do
      if (!this.isSelectedChoiceExistsInSelectedChoiceArray(selectedChoice)) {
        //not exists
        this.setSelectedChioceToSelectedChoiceArray(selectedChoice);
      }
    } else {
      //if choice has unchecked and existed then remove it from the selected choice array
      if (this.isSelectedChoiceExistsInSelectedChoiceArray(selectedChoice)) {
        //exists
        this.removeSelectedChoiceFromSelectedChoiceArray(selectedChoice);
      }
    }
  }

  booleanSwitch(event, choiceId) {
    //step: 13.1: 
    let selectedChoice = new SelectedChoice();
    selectedChoice.choiceId = choiceId;
    // 13.2: check for checkbox checked
    if (event) {
      //if choice is checked and not existed then store it or else no job to do
      if (!this.isSelectedChoiceExistsInSelectedChoiceArray(selectedChoice)) {
        //not exists
        this.setSelectedChioceToSelectedChoiceArray(selectedChoice);
      }
    } else {
      //if choice has unchecked and existed then remove it from the selected choice array
      if (this.isSelectedChoiceExistsInSelectedChoiceArray(selectedChoice)) {
        //exists
        this.removeSelectedChoiceFromSelectedChoiceArray(selectedChoice);
      }
    }
  }

  //step: 13.3
  //check whether a selectedChoice object is exists in selecteChoiceArray or not
  isSelectedChoiceExistsInSelectedChoiceArray(selectedChoice: SelectedChoice) {
    let exstedSelectedChioce = this.selectedChoiceArray.find(choice => choice.choiceId === selectedChoice.choiceId);
    if (exstedSelectedChioce) {
      return true;
    } else {
      return false;
    }
  }

  //step: 13.4 ; remove the selectedChoice object from the selectedChoiceArray
  removeSelectedChoiceFromSelectedChoiceArray(selectedChoice: SelectedChoice) {
    //since, it already existed as selected, so don't do anything
    this.selectedChoiceArray = this.selectedChoiceArray.filter(selectedChoice1 => selectedChoice1.choiceId !== selectedChoice.choiceId);
  }

  //step: 14; next question
  nextQuestion() {
    //step: 14.2;
    if (!this.isSelectedChoiceArrayEmpty()) {
      this.setQuestionIdAndSelectedChoiceArrayToAnsweredAssessment();
    }
    //step: 14.3
    this.questionIndex++;
    this.updateQuestion();
  }

  //step: 14.1; check whether selectedChoiceArray[] is null or not
  isSelectedChoiceArrayEmpty() {
    if (this.selectedChoiceArray.length === 0)
      return true;
    return false;
  }


  //step: 15; next question
  previousQuestion() {
    //step: 15.1
    if (!this.isSelectedChoiceArrayEmpty()) {
      this.setQuestionIdAndSelectedChoiceArrayToAnsweredAssessment();
    }
    //step: 15.2
    this.questionIndex--;
    this.updateQuestion();
  }


  //set question.choices by defalt false
  setAllChoicesOfQuestionFalse() {
    this.question.choices.forEach((choice) => {
      choice.isTrue = false;
    })
  }

  /*--- Timer --- */
  setTimeLeft() {
    var min;
    var sec;
    min = this.minute < 10 ? "0" + this.minute.toString() : this.minute.toString();
    sec = this.second < 10 ? "0" + this.second.toString() : this.second.toString();
    this.timeLeft = min + " : " + sec;
  }
  startTest() {
    this.isTimerStarted = true;
    this.startTimer();
  }
  startTimer() {
    if (this.isTimerStarted) {

      this.interval = setInterval(() => {
        if (this.second > 0) {
          this.second--;
        } else if (this.minute > 0) {
          this.second = 59;
          this.minute--;
        } else {
          //time up, so let's stop the test and send to the final submission
          // this.minute = 0;
        }
        //update timer in every second
        this.setTimeLeft();

      }, 1000);
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  /* Timer - end */

  //submit the assessment or test
  onSubmit(event: Event) {
    event.preventDefault();
    //since user may selected the chioces of the current question and not clicked on next or previous button
    //so, that the current data was not saved to the answeredAssessmentArray[]
    //So we need to check the selectedChoiceArray of the current question has save or not in answeredAssessmentArray[]
    //if not saved then save it, else update it
    //step: 14.2;
    if (!this.isSelectedChoiceArrayEmpty()) {
      this.setQuestionIdAndSelectedChoiceArrayToAnsweredAssessment();
    }
    this.userAssessment.answered = this.answeredAssessmentArray;
    this.calculateScoreAndStoreInDatabase();
  }

  calculateScoreAndStoreInDatabase() {

    this.assessmentService.getAssessmentById(this.assessmentId).subscribe((response: any) => {
      if (response) {
        if (response.status) {
          let originalAssessment = response.result[0];
          if (originalAssessment) {
            let score = 0;
            originalAssessment.questions.forEach((question) => {
              let originalChoices = question.choices;
              this.userAssessment.answered.forEach((answered) => {
                if (question._id === answered.questionId) {
                  let trueChoices = originalChoices.filter(originalChoice => originalChoice.isTrue);
                  let selectedChioces = answered.choices;
                  let outer = trueChoices.length;
                  let inner = 0;
                  let selectedChioceCounter = 0;
                  trueChoices.forEach((originalChoice) => {
                    selectedChioceCounter = selectedChioces.length;
                    selectedChioces.forEach((selectedChioce) => {
                      if (originalChoice._id === selectedChioce.choiceId) {
                        inner++;
                      }
                    });
                    if ((outer === inner) && (outer === selectedChioceCounter))
                      score++;
                  });
                }
              });
            });
            //now setting the global vars by calculated value
            this.userAssessment.scored = score * 5; //let each question has 5 marks, and score is the number of correct question
            this.userAssessment.wrong = this.userAssessment.answered.length - score;//total attemption - correct question
            this.userAssessment.attempted = this.userAssessment.answered.length;//attempt is euqal to the answered question

            //calculation done here... let's store to database
            // //now everything is working fine let's save to database, DATA: this.userAssessment and email
            this.userAssessmentService.createAssessment(this.email, this.userAssessment).subscribe((response: any) => {
              if (response) {
                if (response.status) {
                  this.router.navigate(['assessments/' + this.email + '/show-result']);
                } else {
                  this.errorInfo = "Assessment Couldn't Created!";
                }
              } else {
                this.errorInfo = "Oops! something went wrong. please try again..."
              }
            });


            //data stored 

          }
        }
      }
    });
  }

}
