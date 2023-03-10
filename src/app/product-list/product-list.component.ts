import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../models/product.model";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  selectedProduct?: Product;

  @Input() products?: Product[];
  @Input() type?: string;

  @Output() updateSelectedProduct = new EventEmitter<Product>();
  @Output() editProduct = new EventEmitter<Product>();

  constructor() {}

  setSelectedProduct(product: Product) {
    if (this.type == 'MANAGEMENT') {
      this.selectedProduct == product ? this.selectedProduct = undefined : this.selectedProduct = product;
      this.updateSelectedProduct.emit(this.selectedProduct);
    }
  }

}
