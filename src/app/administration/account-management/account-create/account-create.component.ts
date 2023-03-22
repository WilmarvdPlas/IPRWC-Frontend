import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Account} from "../../../models/account.model";
import {Router} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {NbToastrService} from "@nebular/theme";
import {AccountRequirementsService} from "../../../services/account-requirements.service";

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent {

  @Input() type?: string;

  @Output() setAccounts = new EventEmitter();

  account: Account = new Account(undefined, '', '', '', false);
  passwordRepeat: string = '';

  registerCalled = false;

  constructor(public router: Router, private httpService: HttpService, private toastrService: NbToastrService, public accountRequirementsService: AccountRequirementsService) {}

  register() {
    this.registerCalled = true;
    if (this.accountRequirementsService.accountRequirementsMet(this.account) && this.passwordRepeatSufficient()) {
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
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.onHttpError(error.status);
      }
    })
  }

  postAccountAdministrator() {
    this.httpService.post('account', this.account).subscribe({
      next: () => {
        this.toastrService.success('Account has been created.', 'Success');
        this.registerCalled = false;
        this.account = new Account(undefined, '', '', '', false);
        this.passwordRepeat = '';
        this.setAccounts.emit();
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.onHttpError(error.status);
      }
    })
  }

  onHttpError(status: number) {
    status == 409
      ? this.toastrService.danger('This e-mail address is already in use.', 'Error')
      : this.toastrService.danger('Something went wrong.', 'Error');
  }

  onHttpSuccess() {
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        this.toastrService.success('Account has been created.', 'Success')
      }, 1)
    });
  }

  passwordRepeatSufficient() {
    return this.account.password == this.passwordRepeat;
  }
}
