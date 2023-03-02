export class Account {

  id?: string;
  email?: string;
  password?: string;
  name?: string;
  administrator?: boolean;
  dateCreated?: Date;

  constructor(id?: string, email?: string, password?: string, name?: string, administrator?: boolean, dateCreated?: Date) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.administrator = administrator;
    this.dateCreated = dateCreated;
  }

}
