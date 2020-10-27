import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShowResult } from 'src/app/models/show-result.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { UserAssessmentService } from 'src/app/services/user-assessment.service';

@Component({
  selector: 'app-show-result',
  templateUrl: './show-result.component.html',
  styleUrls: ['./show-result.component.scss']
})
export class ShowResultComponent implements OnInit {
  errorInfo: string;
  email: string;
  showResultArray = [];

  constructor(private assessmentService: AssessmentService,
    private route: ActivatedRoute, private userAssessmentService: UserAssessmentService, private router: Router) { }

  ngOnInit(): void {
    this.verifyUser();
    this.getUserAssessments();
  }

  verifyUser() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.email) {
          this.email = params.email;
        } else {
          this.email = undefined;
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

  getUserAssessments() {

    if (!this.email) {
      this.navigateToBack();

    } else {
      //get all the assessments done by the user
      this.userAssessmentService.getUserAssessmentsByEmail(this.email).subscribe((response: any) => {

        if (response) {

          if (response.status) {
            let userAssessments = response.result;
            for (let us of userAssessments) {
              if (us) {
                let userAssessment = us.userAssessment[0];//user assessment
                console.log('assessmnet' + JSON.stringify(userAssessment))
                console.log('id: ' + userAssessment._id)
                //now, we have user's assessment. since we also need assessment name to show on page. but user assessment 
                //contains only id of the assessment but not the name. so we will find the assessment details by it's id
                //and we need array which should contains assessment details and userAssessment
                this.assessmentService.getAssessmentById(userAssessment._id).subscribe((response: any) => {
                  if (response) {
                    if (response.status) {
                      let showResult = new ShowResult();
                      showResult.userAssessment = userAssessment;
                      showResult.assessment = response.result[0];
                      //now push in showResultArray
                      this.showResultArray.push(showResult);
                    }
                  }
                });

              }
            }

          }
        } else {
          this.errorInfo = "Something went wrong! internal error."
        }

      });

    }

  }


}
