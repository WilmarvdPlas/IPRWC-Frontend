import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Account} from "../../models/account.model";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  accounts?: Account[];
  selectedAccount?: Account;

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  ngOnInit() {
    this.setAccounts();
  }

  setAccounts() {
    this.httpService.get('account').subscribe({
      next: (response) => { this.accounts = response.body; },
      error: () => { this.toastrService.danger('Accounts konden niet opgehaald worden.', 'Error');}
    })
  }

}
