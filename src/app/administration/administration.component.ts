import { Component } from '@angular/core';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent {

  selectedMenu: any = 'productManagement';

  updateSelectedMenu(value: any): void {
    this.selectedMenu = value;
  }

}
