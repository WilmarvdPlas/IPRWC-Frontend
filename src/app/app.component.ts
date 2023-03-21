import { Component } from '@angular/core';
import {RouteGuardService} from "./services/route-guard.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private routeGuardService: RouteGuardService) {}

  checkIllegalRoute() {
    this.routeGuardService.checkIllegalRoute();
  }

}
