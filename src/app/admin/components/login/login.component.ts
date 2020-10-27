import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailError: string;
  passwordError: string;
  loginInfo: string;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
  }

  loginAdmin(email: string, password: string) {
    console.log(email.trim());
    console.log(password.trim());

    if (email.trim() === "") {
      this.emailError = "Please enter your email!";
    } else if (password.trim() === "") {
      this.emailError = "";
      this.passwordError = "Please enter your password!";
    } else if (password.length < 7) {
      this.emailError = "";
      this.passwordError = "Password must contains minimum 8 chars.";
    } else {
      this.emailError = "";
      this.passwordError = "";
      this.adminService.login(email, password).subscribe((response: any) => {
        if (response) {
          //check for any error message
          this.loginInfo = "";
          if (response.status) {
            //status is true, means admin has logged in
            //now add loggedIn admin in session
            localStorage.setItem('ADMIN', JSON.stringify(response.result));
            //now redirect to the admin dashboard
            this.router.navigate(['/admin/dashboard']);
          } else {
            //false, means error occure
            this.loginInfo = response.message;
          }
        }
      });
    }
  }



}
