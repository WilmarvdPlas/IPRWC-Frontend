import {Component, OnInit} from '@angular/core';
import {Transaction} from "../models/transaction.model";
import {HttpService} from "../services/http.service";
import {NbToastrService} from "@nebular/theme";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  selectedMenu: any = 'productManagement';

  transactions: Transaction[] = []

  constructor(private httpService: HttpService, private toastrService: NbToastrService, private userService: UserService) {}

  updateSelectedMenu(value: any): void {
    this.selectedMenu = value;
  }

  ngOnInit() {
    if (this.userService.accountIsActive()) {
      this.setTransactions();
    }
  }

  setTransactions() {
    this.httpService.get('transaction').subscribe({
      next: (response) => {
        response.body.sort((a: { date: Date }, b: { date: Date; }) => (a.date! > b.date!) ? 1 : -1);
        this.transactions = response.body;
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Orders could not be fetched.', 'Error'); }
    })
  }

}
