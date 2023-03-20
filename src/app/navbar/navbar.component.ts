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

  constructor(public userService: UserService, public router: Router, private menuService: NbMenuService) {}

  profileSubscription?: Subscription;
  profileItems = [{ title: 'Profile', data: "PROFILE" }, { title: 'Log out', data: "LOGOUT" }];

  ngOnInit() {
    this.profileSubscription = this.menuService.onItemClick().subscribe({
      next: (value) => {
        if (value.item.data == "LOGOUT") {
          this.userService.logOut();
        } else if (value.item.data == "PROFILE") {
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.profileSubscription?.unsubscribe();
  }

  hideHeaderContent() {
    return this.userService.accountIsActive() || ['/login', '/register'].includes(this.router.url);
  }
}
