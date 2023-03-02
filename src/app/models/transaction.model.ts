import {Account} from "./account.model";

export class Transaction {

  id?: string;
  account?: Account;
  dateCreated?: Date;

  constructor(id?: string, account?: Account, dateCreated?: Date) {
    this.id = id;
    this.account = account;
    this.dateCreated = dateCreated;
  }

}
