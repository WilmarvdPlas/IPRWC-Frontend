import { Component } from '@angular/core';
import {HttpService} from "../../../services/http.service";
import {Product} from "../../../models/product.model";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent {

  product: Product = new Product(undefined, '', '', undefined, '');

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  save() {
    if (this.allFieldsFilled()) {
      this.httpService.post('product', this.product).subscribe({
        next: () => {
          this.clear();
          this.toastrService.success('Product is succesvol aangemaakt.', 'Succes');
        },
        error: () => { this.toastrService.danger('Er is iets misgegaan.', 'Error'); }
      })
    }
  }

  clear() {
    this.product = new Product();
  }

  allFieldsFilled() {
    return this.product.name != ''
      && this.product.priceEuro != undefined
      && this.product.description != ''
      && this.product.imageLink != ''
      && this.product.stock != undefined
      && this.product.discountPercentage != undefined;
  }

}
