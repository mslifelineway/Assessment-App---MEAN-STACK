import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  errorInfo: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  continueTest(email: string) {
    
    if(!this.isEmailValid(email.trim())) {
      this.errorInfo = "Please enter a valid email!";
      return
    }

   //else continue the test
    this.router.navigate(['/assessments/'+ email]);
      
    
  }

  isEmailValid(email: string) {
    var testFound : boolean;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    testFound = regexp.test(email);
    return testFound;
  }
}
