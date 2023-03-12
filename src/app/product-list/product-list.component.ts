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
  @Input() cartProductsCountArray?: number[] = [];
  @Input() type?: string;

  @Output() setProducts = new EventEmitter();
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
    let cartProduct = new CartProduct(undefined, 1, product, this.userService.getActiveAccount());
    this.httpService.post('cart_product', cartProduct).subscribe({
      next: () => { this.toastrService.success('"' + product.name + '" toegevoegd aan winkelwagen.', 'Succes'); },
      error: (error) => {
        error.status == 405
          ? this.toastrService.danger('Er kunnen niet meer dan 100 exemplaren van dit product in uw winkelwagen.', 'Error')
          : this.toastrService.danger('Product kon niet toegevoegd worden aan winkelwagen.', 'Error');
      }
    })
  }

  removeFromCart(product: Product) {
    this.httpService.delete('cart_product/product=' + product.id).subscribe({
      next: () => {
        this.toastrService.success('Product uit winkelwagen verwijderd.', 'Success');
        this.setProducts.emit();
      },
      error: () => { this.toastrService.danger('Product kon niet uit winkelwagen gehaald worden', 'Error'); }
    })
  }

  getRangeOneHundred() {
    return Array.from(Array(100).keys()).map(x => x + 1);
  }

  updateCount(product: Product) {
    this.httpService.put('cart_product/product=' + product.id + "/update_count", this.cartProductsCountArray![this.products?.indexOf(product)!]).subscribe({
      next: () => { this.setProducts.emit(); },
      error: (error) => { console.log(error); }
    })
  }

}
