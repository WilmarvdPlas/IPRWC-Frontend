import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {NbMenuService} from "@nebular/theme";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private router: Router, private menuService: NbMenuService) {}

  profileSubscription?: Subscription;
  profileItems = [{ title: 'Profiel', data: "PROFILE" }, { title: 'Uitloggen', data: "LOGOUT" }];

  ngOnInit() {
    this.profileSubscription = this.menuService.onItemClick().subscribe({
      next: (value) => {
        if (value.item.data == "LOGOUT") {
          this.userService.logOut();
        } else if (value.item.data == "PROFILE") {

        }
      }
    });
  }

  getUserService() {
    return this.userService;
  }

  getRouter() {
    return this.router;
  }

  ngOnDestroy() {
    this.profileSubscription?.unsubscribe();
  }

  hideHeaderContent() {
    return this.userService.getActiveAccount() == undefined || ['/login', '/register'].includes(this.router.url);
  }
}
