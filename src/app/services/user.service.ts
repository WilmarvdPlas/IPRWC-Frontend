import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Account} from "../models/account.model";
import {NbToastrService} from "@nebular/theme";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router, private toastrService: NbToastrService) { }

  setActiveAccount(activeAccount: Account) {
    localStorage.setItem('active-account', JSON.stringify(activeAccount));
  }

  setJwtToken(jwtToken: string) {
    localStorage.setItem('jwt-token', JSON.stringify(jwtToken))
  }

  logOut() {
    this.removeLocalStorage();

    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        this.toastrService.success('You have been successfully logged out', 'Success');
      }, 1)
    });
  }

  logIn(account: Account, token: string) {
    this.setActiveAccount(account);
    this.setJwtToken(token);

    this.router.navigate(['/products']).then(() => {
      setTimeout(() => {
        this.toastrService.success('You have been successfully logged in', 'Success');
      }, 1)
    });
  }

  onUnauthorised() {
    this.removeLocalStorage();

    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        this.toastrService.danger('Session is invalid and may have expired.', 'Error', {limit: 1, duration: 0});
      }, 1)
    });
  }

  getActiveAccount() {
    let activeAccount: any = localStorage.getItem('active-account');
    try {
      activeAccount = JSON.parse(activeAccount);
    } catch (syntaxError) {
      return undefined;
    }

    return activeAccount;
  }

  accountIsActive() {
    let activeAccount: any = localStorage.getItem('active-account');

    try {
      activeAccount = JSON.parse(activeAccount);
    } catch (syntaxError) {
      return false;
    }

    return activeAccount != undefined;
  }

  getJwtToken() {
    let jwtToken: any = localStorage.getItem('jwt-token');

    try {
      jwtToken = JSON.parse(jwtToken);
    } catch (syntaxError) {
      return undefined;
    }

    return jwtToken;
  }

  private removeLocalStorage() {
    localStorage.removeItem('active-account');
    localStorage.removeItem('jwt-token');
  }
}
