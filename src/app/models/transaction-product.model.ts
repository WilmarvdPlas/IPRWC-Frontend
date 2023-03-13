import {Transaction} from "./transaction.model";
import {Product} from "./product.model";

export class TransactionProduct {

  id?: string;
  transaction?: Transaction;
  product?: Product;
  count?: number;
  paymentEuro?: number;
  delivered?: boolean;

  constructor(id?: string, transaction?: Transaction, product?: Product, count?: number, paymentEuro?: number, delivered?: boolean) {
    this.id = id;
    this.transaction = transaction;
    this.product = product;
    this.count = count;
    this.paymentEuro = paymentEuro;
    this.delivered = delivered;
  }

}
