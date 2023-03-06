import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Account} from "../models/account.model";
import {NbToastrService} from "@nebular/theme";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private activeAccount?: Account;
  private jwtToken: any;

  constructor(private router: Router, private toastrService: NbToastrService) { }

  setActiveAccount(activeAccount: Account) {
    this.activeAccount = activeAccount;
    sessionStorage.setItem('active-account', JSON.stringify(activeAccount));
  }

  setJwtToken(jwtToken: string) {
    this.jwtToken = jwtToken;
    sessionStorage.setItem('jwt-token', JSON.stringify(jwtToken))
  }

  logOut() {
    sessionStorage.removeItem('active-account');
    sessionStorage.removeItem('jwt-token');
    this.toastrService.success('Succesvol uitgelogd', 'Succes')
  }

  getActiveAccount() {
    let activeAccount: any = sessionStorage.getItem('active-account');
    activeAccount = JSON.parse(activeAccount);
    this.activeAccount = activeAccount;

    this.checkIllegalRoute(activeAccount)

    return this.activeAccount;
  }

  private checkIllegalRoute(activeAccount: any) {
    let routes = [];

    for (let route of this.router.config) {
      routes.push("/" + route.path)
    }

    if (activeAccount == undefined && routes.includes(this.router.url) && !(['/login', '/register', '/**'].includes(this.router.url))) {
      this.router.navigate(['login'])
    }
  }

  getJwtToken() {
    let jwtToken: any = sessionStorage.getItem('jwt-token');
    jwtToken = JSON.parse(jwtToken);
    this.jwtToken = jwtToken;

    return this.jwtToken;
  }
}
