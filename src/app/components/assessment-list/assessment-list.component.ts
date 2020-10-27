import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {
  assessments: Assessment[];
  message: string;
  email: string;

  constructor(private assessmentService: AssessmentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    //get user email coming from previous page through route as params
    this.getUserEmail();
    if (!this.email) {
      this.router.navigate['home'];
    } else {
      //find all the assessments
      this.findAllAssessments();
    }



  }

  getUserEmail() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.email) {
          this.email = params.email;
        } else {
          this.email = undefined;
        }
      }
    )
  }
  //find all the assessments
  findAllAssessments() {
    this.assessmentService.getAllAssessments().subscribe((response: any) => {
      if (response) {
        if (response.status) {
          //assessments found!
          this.assessments = response.result;
          console.log(this.assessments.length);
        }
      }
      else {
        this.message = "Something went wrong! please try again...";
      }
    });
  }

}
