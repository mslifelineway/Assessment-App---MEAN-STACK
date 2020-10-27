import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { Choice } from 'src/app/models/choice.model';
import { Question } from 'src/app/models/question.model';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { Admin } from 'src/app/models/admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-assessment',
  templateUrl: './new-assessment.component.html',
  styleUrls: ['./new-assessment.component.scss']
})
export class NewAssessmentComponent implements OnInit {
  currentAdmin: Admin;
  questionArray = [];
  assessment = new Assessment();
  message: string;//this will be used to show the information whether data stored in the database.

  constructor(private assessmentService: AssessmentService, private router: Router) {

  }

  ngOnInit(): void {
    //check for current admin
    this.checkForAdminHasLoggedIn();
    this.assessment.name = "";
    this.addNewQuestion();
  }

  checkForAdminHasLoggedIn() {
    //GET THE LOGGED IN USER FROM LOCAL STORAGE
    let localStorageAdmin = localStorage.getItem('ADMIN');
    console.log(localStorageAdmin);
    //now check if admin is there or not
    if (!localStorageAdmin) {
      //admin not found in local storage, so let's redirect to login page
      this.router.navigate(['/admin/login']);
    } else {
      this.currentAdmin = JSON.parse(localStorageAdmin);//parsing the localStorage in json format to use it's properties

      console.log("current admin: " + this.currentAdmin.email);
    }
  }


  //add new question field
  addNewQuestion() {
    //create a question object
    let question = new Question();
    //create a choice array to store all the choices of a questions
    let choiceArray = [];

    //looping for 4 choices
    for (let i = 0; i < 4; i++) {
      //create a temporary choice to store each choice data in every counter
      let choice = new Choice();
      choice.name = "";
      choice.isTrue = false;
      //pushing choice to the choice array
      choiceArray.push(choice);

    }
    //adding choices to the question
    question.choices = choiceArray;
    //after all pushing the question having all the required choices, this is a Global variable
    this.questionArray.push(question);
    //now adding all the questions to the assessment

    this.assessment.questions = this.questionArray;
  }

  /** CREATE ASSESSMENT ON SUBMIT
    *  FOR BOOLEAN CHOICE: CHECK if isQuestionTypeBoolean == true, then store choices[0] (0th index only) in database 
    * because we are storing value for boolean choice in 0 th index of choices
    * BUT FOR OTHER CHOICES CHECK if isQuestionTypeBoolean != true THEN STROE ALL THE CHOICES
    */
  createAssessment(event: Event) {
    // console.log('creating assessment...');
    event.preventDefault();
    // console.log(this.assessment);
    this.assessmentService.createAnAssessment(this.assessment).subscribe((response: any) => {
      // console.log(response.message);
      if (response) {
        if (response.status) {
          // this.message = "Assessment Saved Successfully";
          this.message = response.message;
          // console.log('qarray length: ' + this.questionArray.length);
          this.questionArray = [];
          // console.log('qarray length: ' + this.questionArray.length);
          this.assessment = new Assessment();
          this.addNewQuestion();
        } else {
          // this.message = "error occur while storing to database";
          this.message = response.message;
        }
      } else {
        this.message = "Something went wrong! please try after re-login";
      }
    });

  }



}
