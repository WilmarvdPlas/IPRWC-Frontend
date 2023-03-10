import {Product} from "./product.model";
import {Account} from "./account.model";

export class CartProduct {

  id?: string;
  count?: number;
  product?: Product;
  account?: Account;
  dateCreated?: Date;

  constructor(id?: string, count?: number, product?: Product, account?: Account, dateCreated?: Date) {
    this.id = id;
    this.count = count;
    this.product = product;
    this.account = account;
    this.dateCreated = dateCreated;
  }

}
