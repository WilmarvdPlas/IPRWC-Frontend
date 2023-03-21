import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {CartProduct} from "../models/cart-product.model";
import {HttpService} from "./http.service";
import {NbToastrService} from "@nebular/theme";
import {Account} from "../models/account.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpService: HttpService, private toastrService: NbToastrService) { }

  getLocalStoredCartProducts() {
    let cartProducts: any = localStorage.getItem('cart_products');

    try {
      cartProducts = JSON.parse(cartProducts);
    } catch (syntaxError) {
      return [];
    }

    if (cartProducts == undefined) {
      return [];
    }

    cartProducts.sort((a: { product: Product }, b: { product: Product; }) => (a.product.name! > b.product.name!) ? 1 : -1);
    return cartProducts;
  }

  setLocalStoredCartProducts(cartProducts: CartProduct[]) {
    localStorage.setItem('cart_products', JSON.stringify(cartProducts))
  }

  postLocalStoredCartProducts(account: Account) {
    let cartProducts = this.getLocalStoredCartProducts();

    if (cartProducts.length != 0) {
      for (let cartProduct of cartProducts) {
        cartProduct.account = account;
      }
      this.httpService.post('cart_product/transfer_cart', cartProducts).subscribe({
        next: () => {
          this.toastrService.success('Contents of cart have been transferred to your account.', 'Success');
          localStorage.removeItem('cart_products');
        },
        error: (error) => {
          this.httpService.authorisedFilter(error.status);
          this.toastrService.danger('Contents of cart could not be transferred to your account.', 'Error');
        }
      })
    }
  }

  updateCountLocalStoredCartProduct(cartProduct: CartProduct) {
    let cartProducts = this.getLocalStoredCartProducts();

    let cartProductInLocalStorage = cartProducts.find((localStoredCartProduct: CartProduct) => localStoredCartProduct.product?.id == cartProduct.product?.id);
    cartProducts[cartProducts.indexOf(cartProductInLocalStorage)] = cartProduct

    this.setLocalStoredCartProducts(cartProducts)
  }

  removeLocalStoredCartProduct(cartProduct: CartProduct) {
    let cartProducts = this.getLocalStoredCartProducts();

    cartProducts = cartProducts.filter((localStoredCartProduct: CartProduct) => localStoredCartProduct.product?.id != cartProduct.product?.id)

    this.setLocalStoredCartProducts(cartProducts);
    this.toastrService.success( '"' + cartProduct.product?.name + '" removed from cart.', 'Success');
  }

  addLocalStoredCartProduct(cartProduct: CartProduct) {
    let cartProducts = this.getLocalStoredCartProducts();

    let cartProductInLocalStorage = cartProducts.find((localStoredCartProduct: CartProduct) => localStoredCartProduct.product?.id == cartProduct.product?.id);

    if (cartProductInLocalStorage == undefined) {
      cartProducts.push(cartProduct);
    } else if (cartProductInLocalStorage.count >= 100) {
      this.toastrService.danger("You can't add more than 100 copies of this item to your cart." , 'Error')
      return;
    } else {
      cartProductInLocalStorage.count += 1;
    }

    this.toastrService.success('"' + cartProduct.product?.name + '" added to cart.', 'Success');

    this.setLocalStoredCartProducts(cartProducts);
  }

}
