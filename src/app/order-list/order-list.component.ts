import {Component, Input} from '@angular/core';
import {Transaction} from "../models/transaction.model";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {

  @Input() transactions?: Transaction[];

}
