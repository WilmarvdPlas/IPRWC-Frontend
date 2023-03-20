import { Injectable } from '@angular/core';
import {Account} from "../models/account.model";

@Injectable({
  providedIn: 'root'
})
export class AccountRequirementsService {

  accountRequirementsMet(account: Account) : boolean {
    return (this.passwordSufficient(account.password!) && this.emailSufficient(account.email!) && this.nameSufficient(account.name!))
  }

  passwordSufficient(password: string | undefined) : boolean {
    if (password == undefined) {
      return false;
    }
    const passwordRegex = new RegExp("(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$");
    return passwordRegex.test(password);
  }

  emailSufficient(email: string | undefined) : boolean {
    if (email == undefined) {
      return false;
    }
    const emailRegex = new RegExp(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/);
    return emailRegex.test(email)
  }

  nameSufficient(name: string | undefined) {
    if (name == undefined) {
      return false;
    }
    return name.length > 0;
  }

}
