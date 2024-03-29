import {Component, OnInit} from '@angular/core';
import {Transaction} from "../models/transaction.model";
import {HttpService} from "../services/http.service";
import {UserService} from "../services/user.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  transactions?: Transaction[] = [];

  constructor(private httpService: HttpService, private userService: UserService, private toastrService: NbToastrService) {
  }

  ngOnInit() {
    if (this.userService.accountIsActive()) {
      this.setTransactions();
    }
  }

  setTransactions() {
    this.httpService.get('transaction/account=' + this.userService.getActiveAccount()?.id).subscribe({
      next: (response) => {
        response.body.sort((a: { date: Date }, b: { date: Date; }) => (a.date! > b.date!) ? 1 : -1);
        this.transactions = response.body;
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Orders could not be fetched', 'Error');
      }
    })
  }

}
