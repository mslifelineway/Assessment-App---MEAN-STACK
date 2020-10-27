import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private webReqService: WebRequestService) { 


  }

  //signUp
  register(name: string, email: string, password: string) {
    return this.webReqService.post("admin/register", {name, email, password});
  }
  //login admin
  login(email: string, password: string) {
    return this.webReqService.post("admin/login", {email, password});
  }

}
