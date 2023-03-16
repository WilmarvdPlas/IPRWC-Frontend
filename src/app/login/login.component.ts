import {Component} from '@angular/core';
import {LoginCredentials} from "../models/login-credentials.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {HttpService} from "../services/http.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginCredentials: LoginCredentials = new LoginCredentials('', '');
  logInCalled: boolean = false;

  constructor(public router: Router, private userService: UserService, private httpService: HttpService, private toastrService: NbToastrService) {
  }

  logIn() {
    this.logInCalled = true;
    if (this.loginCredentials.password != '' && this.loginCredentials.email != '') {
      this.postCredentials();
    }
  }

  postCredentials() {
    this.httpService.post("auth/login", this.loginCredentials).subscribe({
      next: (response) => {
        this.userService.logIn(response.body.account, response.body.token);
      },
      error: (error) => {
        error.status == 401
          ? this.toastrService.danger('This combination of e-mail address and password does not exist.', 'Error')
          : this.toastrService.danger('Something went wrong.', 'Error');
      }
    });
  }
}
