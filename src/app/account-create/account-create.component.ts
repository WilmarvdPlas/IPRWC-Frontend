import {Component, Input} from '@angular/core';
import {Account} from "../models/account.model";
import {Router} from "@angular/router";
import {HttpService} from "../services/http.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent {

  @Input() type?: string;

  account: Account = new Account(undefined, '', '', '', false);
  passwordRepeat: string = '';

  registerCalled = false;

  constructor(public router: Router, private httpService: HttpService, private toastrService: NbToastrService) {}

  register() {
    this.registerCalled = true;
    if (this.passwordSufficient() && this.emailSufficient() && this.nameSufficient() && this.passwordRepeatSufficient()) {
      if (this.type == "REGISTER") {
        this.postAccountUser()
      } else if (this.type == "ADMINISTRATION") {
        this.postAccountAdministrator()
      }
    }
  }

  postAccountUser() {
    this.httpService.post('account/register', this.account).subscribe({
      next: () => { this.onHttpSuccess(); },
      error: (error) => { this.onHttpError(error.status); }
    })
  }

  postAccountAdministrator() {
    this.httpService.post('account', this.account).subscribe({
      next: () => {
        this.toastrService.show('Account succesvol is aangemaakt.', 'Succes', {status: 'success'});
        this.registerCalled = false;
        this.account = new Account(undefined, '', '', '', false);
        this.passwordRepeat = '';
      },
      error: (error) => { this.onHttpError(error.status); }
    })
  }

  onHttpError(status: number) {
    status == 409
      ? this.toastrService.show('Dit e-mailadres is al in gebruik.', 'Error', {status: 'danger'})
      : this.toastrService.show('Er is iets mis gegaan.', 'Error', {status: 'danger'});
  }

  onHttpSuccess() {
    this.router.navigate(['/login']).then(() => {
      this.toastrService.show('Account succesvol is aangemaakt.', 'Succes', {status: 'success'})
    });
  }

  passwordSufficient() : boolean {
    const passwordRegex = new RegExp("(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$");
    return passwordRegex.test(this.account.password!);
  }

  emailSufficient() : boolean {
    const emailRegex = new RegExp(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/);
    return emailRegex.test(this.account.email!)
  }

  nameSufficient() {
    return this.account.name!.length > 0;
  }

  passwordRepeatSufficient() {
    return this.account.password == this.passwordRepeat;
  }
}
