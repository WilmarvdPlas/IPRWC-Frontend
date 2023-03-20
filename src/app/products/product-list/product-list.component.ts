import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {HttpService} from "../../services/http.service";
import {CartProduct} from "../../models/cart-product.model";
import {UserService} from "../../services/user.service";
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
  @Input() cartProducts?: CartProduct[] = [];
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
      next: () => { this.toastrService.success('"' + product.name + '" added to cart.', 'Success'); },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        error.status == 406
          ? this.toastrService.danger("You can't add more than 100 copies of this item to your cart." , 'Error')
          : this.toastrService.danger('Item could not be added to cart.', 'Error');
      }
    })
  }

  removeFromCart(cartProduct: CartProduct) {
    this.httpService.delete('cart_product/' + cartProduct.id).subscribe({
      next: () => {
        this.toastrService.success( '"' + cartProduct.product?.name + '" removed from cart.', 'Success');
        this.setProducts.emit();
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('"' + cartProduct.product?.name + '" could not be removed to cart.', 'Error');
      }
    })
  }

  getRangeOneHundred() {
    return Array.from(Array(100).keys()).map(x => x + 1);
  }

  updateCount(cartProduct: CartProduct) {
    this.httpService.put('cart_product/' + cartProduct.id + "/update_count", this.cartProductsCountArray![this.products?.indexOf(cartProduct.product!)!]).subscribe({
      next: () => { this.setProducts.emit(); },
      error: (error) => { this.httpService.authorisedFilter(error.status); }
    })
  }

}
