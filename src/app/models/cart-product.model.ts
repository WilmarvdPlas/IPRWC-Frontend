import {Product} from "./product.model";
import {Account} from "./account.model";

export class CartProduct {

  id?: string;
  product?: Product;
  account?: Account;
  dateCreated?: Date;

  constructor(id?: string, product?: Product, account?: Account, dateCreated?: Date) {
    this.id = id;
    this.product = product;
    this.account = account;
    this.dateCreated = dateCreated;
  }

}
