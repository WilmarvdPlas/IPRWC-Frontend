import {Component, Input, OnChanges} from '@angular/core';
import {Transaction} from "../models/transaction.model";
import {HttpService} from "../services/http.service";
import {TransactionProduct} from "../models/transaction-product.model";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnChanges {

  @Input() transactions?: Transaction[];
  transactionProductsList = new Map<Transaction, TransactionProduct[]>()

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  ngOnChanges() {
    for (let transaction of this.transactions!) {
      this.httpService.get('transaction_product/transaction=' + transaction.id).subscribe({
        next: (response) => { this.transactionProductsList.set(transaction, response.body); },
        error: () => { this.toastrService.danger('Producten van bestelling ' + transaction.id + ' konden niet opgehaald worden.', 'Error'); }
      })
    }
  }

  getTotalPayment(transaction: Transaction) {
    let totalPayment = 3.99;
    for (let transactionProduct of this.transactionProductsList.get(transaction)!) {
      totalPayment += transactionProduct.paymentEuro!;
    }
    return totalPayment;
  }

  getProductCount(transaction: Transaction) {
    let productCount = 0;
    for (let transactionProduct of this.transactionProductsList.get(transaction)!) {
      productCount += transactionProduct.count!;
    }
    return productCount;
  }

}
