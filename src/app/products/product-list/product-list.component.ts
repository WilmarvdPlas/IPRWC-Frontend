import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {HttpService} from "../../services/http.service";
import {CartProduct} from "../../models/cart-product.model";
import {UserService} from "../../services/user.service";
import {NbToastrService} from "@nebular/theme";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  selectedProduct?: Product;

  @Input() products?: Product[];
  @Input() cartProductCountsArray: number[] = [];
  @Input() cartProducts: CartProduct[] = [];
  @Input() type?: string;

  @Output() setProducts = new EventEmitter();
  @Output() updateSelectedProduct = new EventEmitter<Product>();
  @Output() editProduct = new EventEmitter<Product>();

  constructor(private httpService: HttpService, private userService: UserService, private toastrService: NbToastrService, private cartService: CartService) {}

  setSelectedProduct(product: Product) {
    if (this.type == 'MANAGEMENT') {
      this.selectedProduct == product ? this.selectedProduct = undefined : this.selectedProduct = product;
      this.updateSelectedProduct.emit(this.selectedProduct);
    }
  }

  addToCart(product: Product) {
    let cartProduct = new CartProduct(undefined, 1, product, this.userService.getActiveAccount());

    if (this.userService.accountIsActive()) {
      this.httpPostCartProduct(cartProduct)
    } else {
      this.cartService.addLocalStoredCartProduct(cartProduct);
    }
  }

  httpPostCartProduct(cartProduct: CartProduct) {
    this.httpService.post('cart_product', cartProduct).subscribe({
      next: () => { this.toastrService.success('"' + cartProduct.product?.name + '" added to cart.', 'Success'); },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        error.status == 409
          ? this.toastrService.danger("You can't add more than 100 copies of this item to your cart." , 'Error')
          : this.toastrService.danger('Item could not be added to cart.', 'Error');
      }
    })
  }

  httpDeleteCartProduct(cartProduct: CartProduct) {
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

  removeFromCart(cartProduct: CartProduct) {
    if (this.userService.accountIsActive()) {
      this.httpDeleteCartProduct(cartProduct);
    } else {
      this.cartService.removeLocalStoredCartProduct(cartProduct);
      this.setProducts.emit();
    }
  }

  getRangeOneHundred() {
    return Array.from(Array(100).keys()).map(x => x + 1);
  }

  updateCount(cartProduct: CartProduct) {
    if (this.userService.accountIsActive()) {
      this.httpUpdateCount(cartProduct)
    } else {
      cartProduct.count = this.cartProductCountsArray![this.products?.indexOf(cartProduct.product!)!];
      this.cartService.updateCountLocalStoredCartProduct(cartProduct);
      this.setProducts.emit();
    }
  }

  httpUpdateCount(cartProduct: CartProduct) {
    this.httpService.put('cart_product/' + cartProduct.id + "/update_count", this.cartProductCountsArray![this.products?.indexOf(cartProduct.product!)!]).subscribe({
      next: () => { this.setProducts.emit(); },
      error: (error) => { this.httpService.authorisedFilter(error.status); }
    })
  }

}
