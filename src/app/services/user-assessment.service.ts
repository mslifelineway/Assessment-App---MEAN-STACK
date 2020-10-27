import { Injectable } from '@angular/core';
import { UserAssessment } from '../models/user.assessment';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class UserAssessmentService {

  constructor(private webReqService: WebRequestService) { }


  //create/save an user assessment
  createAssessment(email: string, userAssessment: UserAssessment) {
    return this.webReqService.post('user/assessments', {email, userAssessment});
  }

  //find user assessments
  getUserAssessmentsByEmail(email: string) {
    return this.webReqService.get('user/assessments/'+email);
  }
}
