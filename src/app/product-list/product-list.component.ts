import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../models/product.model";
import {HttpService} from "../services/http.service";
import {CartProduct} from "../models/cart-product.model";
import {UserService} from "../services/user.service";
import {NbToastrService} from "@nebular/theme";

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

  constructor(private httpService: HttpService, private userService: UserService, private toastrService: NbToastrService) {}

  setSelectedProduct(product: Product) {
    if (this.type == 'MANAGEMENT') {
      this.selectedProduct == product ? this.selectedProduct = undefined : this.selectedProduct = product;
      this.updateSelectedProduct.emit(this.selectedProduct);
    }
  }

  addToCart(product: Product) {
    let cartProduct = new CartProduct(undefined, product, this.userService.getActiveAccount() );
    this.httpService.post('cart_product', cartProduct).subscribe({
      next: () => { this.toastrService.success('"' + product.name + '" toegevoegd aan winkelwagen.', 'Succes'); },
      error: () => { this.toastrService.danger('Product kon niet toegevoegd worden aan winkelwagen.', 'Error') }
    })
  }

}
