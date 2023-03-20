import {Component, OnInit} from '@angular/core';
import {Account} from "../models/account.model";
import {UserService} from "../services/user.service";
import {AccountRequirementsService} from "../services/account-requirements.service";
import {HttpService} from "../services/http.service";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {
  AccountManagementDialogComponent
} from "../administration/account-management/account-management-dialog/account-management-dialog.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  account: Account = new Account();

  oldPassword = '';
  newPassword = ''
  newPasswordRepeat = '';

  changePasswordCalled = false;


  constructor(private userService: UserService,
              public accountRequirementsService: AccountRequirementsService,
              private httpService: HttpService,
              private toastrService: NbToastrService,
              private dialogService: NbDialogService,
              private router: Router) {
  }

  ngOnInit() {
    this.setAccount();
  }

  saveAccount() {
    if (this.accountRequirementsService.nameSufficient(this.account.name!) && this.accountRequirementsService.emailSufficient(this.account.email!)) {
      this.httpService.put('account/' + this.account.id, this.account).subscribe({
        next: (response) => {
          this.toastrService.success('Changes to account have been saved.', 'Success');
          this.userService.setJwtToken(response.body.token)
          this.userService.setActiveAccount(this.account)
        },
        error: (error) => {
          this.httpService.authorisedFilter(error.status)
          this.toastrService.danger('Changes to account could not be saved.', 'Error'); }
      })
    }
  }

  setAccount() {
    this.userService.accountIsActive() ? this.account = this.userService.getActiveAccount() : this.router.navigate(['login']);
  }

  passwordRepeatSufficient() {
    return this.newPassword == this.newPasswordRepeat;
  }

  oldPasswordSufficient() {
    return this.oldPassword != '';
  }

  openDeleteDialog() {
    this.dialogService.open(AccountManagementDialogComponent, {context: {
        account: this.account,
        actionText: 'You are about to delete the following account:',
        consequenceText: 'If you delete this account, it will permanently disappear from the system. There will be no possibility of recovering this account.',
        type: 'DELETE_PROFILE'
      }
    })
  }

  changePassword() {
    this.changePasswordCalled = true;

    if (this.passwordRepeatSufficient() && this.accountRequirementsService.passwordSufficient(this.newPassword) && this.oldPasswordSufficient()) {
      this.httpService.put('account/' + this.account.id + '/change_password', {oldPassword: this.oldPassword, newPassword: this.newPassword}).subscribe({
        next: () => {
          this.toastrService.success('Password has been changed.', 'Success');
          this.setPasswordFieldsEmpty();
        },
        error: (error) => {
          console.log(error)
          error.status == 401
            ? this.toastrService.danger('Credentials are incorrect.','Error')
            : this.toastrService.danger('Something went wrong.', 'Error')
        }
      })
    }
  }

  setPasswordFieldsEmpty() {
    this.changePasswordCalled = false;

    this.oldPassword = '';
    this.newPassword = '';
    this.newPasswordRepeat = '';
  }

}
