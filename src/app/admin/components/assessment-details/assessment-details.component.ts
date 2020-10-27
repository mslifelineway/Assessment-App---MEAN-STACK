import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Admin } from 'src/app/models/admin.model';
import { Assessment } from 'src/app/models/assessment.model';
import { Choice } from 'src/app/models/choice.model';
import { Question } from 'src/app/models/question.model';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.scss']
})
export class AssessmentDetailsComponent implements OnInit {
  currentAdmin: Admin;
  questionArray = [];
  assessment: Assessment;
  assessmentId: string;

  errorInfo: string;//to show if any error

  constructor(private assessmentService: AssessmentService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    //check for current admin
    this.checkForAdminHasLoggedIn();
    this.getAssessmentId();
    this.getAssessmentById();
  }

  //subscribing the assessmentId coming through the url params
  getAssessmentId() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.assessmentId) {
          this.assessmentId = params.assessmentId;
        } else {
          this.assessmentId = undefined;
          //navigate to login
          this.router.navigate(['/admin/login']);
        }
      }
    )
  }

  //get the assessment by id
  getAssessmentById() {
    this.assessmentService.getAssessmentById(this.assessmentId).subscribe((response: any) => {
      if (response) {
        if (response.status) {
          this.assessment = response.result[0];
        } else {
          this.errorInfo = "Assessment not exists! please try again..."
        }
      } else {
        this.errorInfo = "Oops! something went wrong...";
      }
    });
  }


  //check for admin has logged in or not
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

  //logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/admin/login']);
  }
}
