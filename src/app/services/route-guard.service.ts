import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private userService: UserService, private router: Router) {}

  public checkIllegalRoute() {
    let routes = [];

    for (let route of this.router.config) {
      routes.push("/" + route.path)
    }

    let guestRoutes = ['/login', '/register', '/**', '/products', '/cart'];
    let userRoutes = ['/orders', '/profile'].concat(guestRoutes);

    if (!this.userService.accountIsActive() && routes.includes(this.router.url) && !(guestRoutes.includes(this.router.url))) {
      this.router.navigate(['products']).then()
      return;
    } else if (
      this.userService.accountIsActive() &&
      !this.userService.getActiveAccount().administrator &&
      routes.includes(this.router.url) &&
      !(userRoutes.includes(this.router.url)))
    {
      this.router.navigate(['products']).then()
    }
  }

}
