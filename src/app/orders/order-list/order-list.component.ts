import {Component, Input, OnChanges} from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {HttpService} from "../../services/http.service";
import {TransactionProduct} from "../../models/transaction-product.model";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnChanges {

  @Input() transactions?: Transaction[];
  @Input() type?: string;

  transactionProductsList = new Map<Transaction, TransactionProduct[]>()

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  ngOnChanges() {
    for (let transaction of this.transactions!) {
      this.httpService.get('transaction_product/transaction=' + transaction.id).subscribe({
        next: (response) => { this.transactionProductsList.set(transaction, response.body); },
        error: (error) => {
          this.httpService.authorisedFilter(error.status);
          this.toastrService.danger('Items of order ' + transaction.id + ' could not be fetched.', 'Error');
        }
      })
    }
  }

  getTotalPayment(transaction: Transaction) {
    let transactionProducts = this.transactionProductsList.get(transaction)!;
    let totalPayment = 3.99;

    if (Array.isArray(transactionProducts)) {
      for (let transactionProduct of transactionProducts) {
        totalPayment += transactionProduct.paymentEuro!;
      }
    }

    return totalPayment;
  }

  getProductCount(transaction: Transaction) {
    let transactionProducts = this.transactionProductsList.get(transaction)!;
    let productCount = 0;

    if (Array.isArray(transactionProducts)) {
      for (let transactionProduct of transactionProducts) {
        productCount += transactionProduct.count!;
      }
    }

    return productCount;
  }

}
