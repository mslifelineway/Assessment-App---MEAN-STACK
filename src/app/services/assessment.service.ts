import { Injectable } from '@angular/core';
import { AssessmentDetailsComponent } from '../admin/components/assessment-details/assessment-details.component';
import { Assessment } from '../models/assessment.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private webReqService: WebRequestService) { }

  //create an assessment
  createAnAssessment(assessment: Assessment) {
    return this.webReqService.post("assessments", {assessment});
  }

  //get all the getAllAssessments
  getAllAssessments() {
    return this.webReqService.get("assessments");
  }

  //get Assessment by id
  getAssessmentById(assessmentId: string){
    return this.webReqService.get("assessments/"+ assessmentId );
  }
}
