import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "../services/http.service";
import {Account} from "../models/account.model";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  account: Account = new Account(undefined, '', '', '', false);
  passwordRepeat: string = '';

  registerCalled = false;

  constructor(public router: Router, private httpService: HttpService, private toastrService: NbToastrService) {}

  register() {
    this.registerCalled = true;
    if (this.passwordSufficient() && this.emailSufficient() && this.nameSufficient() && this.passwordRepeatSufficient()) {
      this.httpService.post('account/register', this.account).subscribe({
        next: () => { this.onHttpSuccess(); },
        error: (error) => { this.onHttpError(error.status); }
      })
    }
  }

  onHttpError(status: number) {
    status == 409
      ? this.toastrService.show('Dit e-mailadres is al in gebruik.', 'Error', {status: 'danger'})
      : this.toastrService.show('Er is iets mis gegaan.', 'Error', {status: 'danger'});
  }

  onHttpSuccess() {
    this.router.navigate(['/login']).then(() => {
      this.toastrService.show('Uw account is aangemaakt.', 'Succes', {status: 'success'})
    });
  }

  passwordSufficient() : boolean {
    const passwordRegex = new RegExp("(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$");
    return passwordRegex.test(this.account.password!);
  }

  emailSufficient() : boolean {
    const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    return emailRegex.test(this.account.email!)
  }

  nameSufficient() {
    return this.account.name!.length > 0;
  }

  passwordRepeatSufficient() {
    return this.account.password == this.passwordRepeat;
  }

}
