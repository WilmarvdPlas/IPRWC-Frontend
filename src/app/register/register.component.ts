import {Component, EventEmitter, Output} from '@angular/core';
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

  name: string = '';
  email: string = '';
  password: string = '';
  passwordRepeat: string = '';

  registerCalled = false;

  constructor(protected router: Router, private httpService: HttpService, private toastrService: NbToastrService) {}

  register() {
    this.registerCalled = true;
    if (this.passwordSufficient() && this.emailSufficient() && this.nameSufficient() && this.passwordRepeatSufficient()) {

      let registeredAccount = new Account(undefined, this.email, this.password, this.name, false);

      this.httpService.post('account/register', registeredAccount).subscribe({
        next: () => { this.onHttpSuccess(); },
        error: (error) => { this.onHttpError(error.status); }
      })
    }
  }

  onHttpError(status: number) {
    status == 409
      ? this.toastrService.show('Dit e-mailadres is al in gebruik.', 'Registratie mislukt!', {status: 'danger'})
      : this.toastrService.show('Er is iets mis gegaan.', 'Registratie mislukt!', {status: 'danger'});
  }

  onHttpSuccess() {
    this.router.navigate(['/login']).then(() => {
      this.toastrService.show('Uw account is aangemaakt.', 'Registratie succesvol!', {status: 'success'})
    });
  }

  passwordSufficient() : boolean {
    const passwordRegex = new RegExp("(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$");
    return passwordRegex.test(this.password);
  }

  emailSufficient() : boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(this.email)
  }

  nameSufficient() {
    return this.name.length > 0;
  }

  passwordRepeatSufficient() {
    return this.password == this.passwordRepeat;
  }

}
