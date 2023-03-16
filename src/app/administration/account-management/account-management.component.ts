import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Account} from "../../models/account.model";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {AccountManagementDialogComponent} from "./account-management-dialog/account-management-dialog.component";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  accounts?: Account[];
  selectedAccount?: Account;

  constructor(private httpService: HttpService, private toastrService: NbToastrService, private dialogService: NbDialogService) {}

  ngOnInit() {
    this.setAccounts();
  }

  setAccounts() {
    this.httpService.get('account').subscribe({
      next: (response) => { this.accounts = response.body; },
      error: () => { this.toastrService.danger('Accounts konden niet opgehaald worden.', 'Error');}
    })
  }

  openAdministratorDialog() {
    this.dialogService.open(AccountManagementDialogComponent,
      {context: {
          account: this.selectedAccount,
          actionText: 'U staat op het punt om aan het volgende account beheerder rechten te verlenen:',
          consequenceText: 'Als u aan dit account beheeder rechten verleent krijgt dit account toegang tot het beheren van producten, accounts en bestellingen. ' +
            'Deze rechten kunnen via de in-app interface niet ontnomen worden.',
          type: 'ADMINISTRATOR'
      }})
      .onClose.subscribe(() => {
      this.setAccounts();
    })
  }

  openDeleteDialog() {
    this.dialogService.open(AccountManagementDialogComponent,
      {context: {
          account: this.selectedAccount,
          actionText: 'U staat op het punt om het volgende account te verwijderen:',
          consequenceText: 'Als u dit account verwijderd, zal dit account permanent uit het systeem verdwijnen. Er zal geen mogelijkheid bestaan om dit account terug te halen.',
          type: 'DELETE'
        }})
      .onClose.subscribe(() => {
      this.setAccounts();
    })
  }

}
