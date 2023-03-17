import {Component, OnInit} from '@angular/core';
import {Account} from "../models/account.model";
import {UserService} from "../services/user.service";
import {AccountRequirementsService} from "../services/account-requirements.service";
import {HttpService} from "../services/http.service";
import {NbToastrService} from "@nebular/theme";
import {LoginCredentials} from "../models/login-credentials.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  account: Account = new Account();
  passwordRepeat = '';

  constructor(private userService: UserService, public accountRequirementsService: AccountRequirementsService, private httpService: HttpService, private toastrService: NbToastrService) {
  }

  ngOnInit() {
    this.setAccount();
  }

  saveAccount() {
    if (this.accountRequirementsService.nameSufficient(this.account.name!) && this.accountRequirementsService.emailSufficient(this.account.email!)) {
      this.httpService.put('account/' + this.account.id, this.account).subscribe({
        next: (response) => {
          this.toastrService.success('Account has been edited.', 'Success');
          this.userService.setJwtToken(response.body.token)
          this.userService.setActiveAccount(this.account)
        },
        error: (error) => { this.toastrService.danger('Account could not be edited.', 'Error'); console.log(error) }
      })
    }
  }

  setAccount() {
    this.account = this.userService.getActiveAccount()!;
  }

  passwordRepeatSufficient() {
    return this.account.password == this.passwordRepeat;
  }

}
