import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {NbMenuService} from "@nebular/theme";
import {Subscription} from "rxjs";
import {Account} from "../models/account.model";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(public userService: UserService, public router: Router, private menuService: NbMenuService) {}

  profileSubscription?: Subscription;
  profileItems: any;
  activeAccount?: Account;

  ngOnInit() {
    this.activeAccount = this.userService.getActiveAccount();

    if (this.userService.accountIsActive()) {
      this.profileItems = [{ title: 'Profile', data: "PROFILE" }, { title: 'Log out', data: "LOGOUT" }]
    } else {
      this.profileItems = [{ title: 'Create account', data: "REGISTER" }, { title: 'Log in', data: "LOGIN" }]
    }

    this.profileSubscription = this.menuService.onItemClick().subscribe({
      next: (value) => {
        if (value.item.data == "LOGOUT") {
          this.userService.logOut();
        } else if (value.item.data == "PROFILE") {
          this.router.navigate(['/profile']);
        } else if (value.item.data == 'REGISTER') {
          this.router.navigate(['/register']);
        } else if (value.item.data == 'LOGIN') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.profileSubscription?.unsubscribe();
  }

  hideHeaderContent() {
    return !this.userService.accountIsActive() || ['/login', '/register'].includes(this.router.url);
  }
}
