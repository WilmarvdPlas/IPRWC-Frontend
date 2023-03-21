import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Account} from "../../models/account.model";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {AccountManagementDialogComponent} from "./account-management-dialog/account-management-dialog.component";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  accounts?: Account[];
  selectedAccount?: Account;

  constructor(private httpService: HttpService, private toastrService: NbToastrService, private dialogService: NbDialogService, private userService: UserService) {}

  ngOnInit() {
    if (this.userService.accountIsActive()) {
      this.setAccounts();
    }
  }

  setAccounts() {
    this.httpService.get('account').subscribe({
      next: (response) => { this.accounts = response.body; },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Accounts could not be fetched.', 'Error');
      }
    })
  }

  openAdministratorDialog() {
    this.dialogService.open(AccountManagementDialogComponent,
      {context: {
          account: this.selectedAccount,
          actionText: 'You are about to grant administrative rights to the following account:',
          consequenceText: 'If you grant administrative rights to this account, it will gain access to product-, account- and order management. ' +
            'These rights can not be retracted using the in-app interface.',
          type: 'ADMINISTRATOR'
      }})
      .onClose.subscribe(() => {
      this.setAccounts();
    })
  }

  openDeleteDialog() {
    this.dialogService.open(AccountManagementDialogComponent, {context: {
          account: this.selectedAccount,
          actionText: 'You are about to delete the following account:',
          consequenceText: 'If you delete this account, it will permanently disappear from the system. There will be no possibility of recovering this account.',
          type: 'DELETE_ADMINISTRATION'
        }})
      .onClose.subscribe(() => {
      this.setAccounts();
    })
  }

}
