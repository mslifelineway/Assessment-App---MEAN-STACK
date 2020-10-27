import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from 'src/app/models/admin.model';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentAdmin: Admin;
  assessments: Assessment[];
  errorInfo: string;

  constructor(private router: Router, private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    //check admin has logged in or not  
    this.checkForAdminHasLoggedIn();
    //get all the assessments
    this.getAssessments();
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
    }
  }

  getAssessments() {
    this.assessmentService.getAllAssessments().subscribe((response: any) => {
      if(response) {
        if(response.status) {
          //response found
          this.assessments = response.result;
          console.log(this.assessments)
        } else {
          this.errorInfo = "No assessments found! Internal error...";
        }
      } else {
        this.errorInfo = "Oops! something went wrong. Internal error...";
      }
    });
  }

  //logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/admin/login']);
  }
}
