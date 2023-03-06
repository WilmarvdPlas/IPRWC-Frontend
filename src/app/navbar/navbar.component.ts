import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(protected userService: UserService, private router: Router) {}

  hideHeaderContent() {
    return this.userService.getActiveAccount() == undefined || ['/login', '/register'].includes(this.router.url);
  }
}
