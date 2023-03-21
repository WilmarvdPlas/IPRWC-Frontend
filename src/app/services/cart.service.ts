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

  getSessionStoredCartProducts() {
    let cartProducts: any = sessionStorage.getItem('cart_products');

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

  setSessionStoredCartProducts(cartProducts: CartProduct[]) {
    sessionStorage.setItem('cart_products', JSON.stringify(cartProducts))
  }

  postSessionStoredCartProducts(account: Account) {
    let cartProducts = this.getSessionStoredCartProducts();

    if (cartProducts.length != 0) {
      for (let cartProduct of cartProducts) {
        cartProduct.account = account;
      }
      this.httpService.post('cart_product/transfer_cart', cartProducts).subscribe({
        next: () => {
          this.toastrService.success('Contents of cart have been transferred to your account.', 'Success');
          sessionStorage.removeItem('cart_products');
        },
        error: (error) => {
          this.httpService.authorisedFilter(error.status);
          this.toastrService.danger('Contents of cart could not be transferred to your account.', 'Error');
        }
      })
    }
  }

  updateCountSessionStoredCartProduct(cartProduct: CartProduct) {
    let cartProducts = this.getSessionStoredCartProducts();

    let cartProductInSessionStorage = cartProducts.find((sessionStoredCartProduct: CartProduct) => sessionStoredCartProduct.product?.id == cartProduct.product?.id);
    cartProducts[cartProducts.indexOf(cartProductInSessionStorage)] = cartProduct

    this.setSessionStoredCartProducts(cartProducts)
  }

  removeSessionStoredCartProduct(cartProduct: CartProduct) {
    let cartProducts = this.getSessionStoredCartProducts();

    cartProducts = cartProducts.filter((sessionStoredCartProduct: CartProduct) => sessionStoredCartProduct.product?.id != cartProduct.product?.id)

    this.setSessionStoredCartProducts(cartProducts);
    this.toastrService.success( '"' + cartProduct.product?.name + '" removed from cart.', 'Success');
  }

  addSessionStoredCartProduct(cartProduct: CartProduct) {
    let cartProducts = this.getSessionStoredCartProducts();

    let cartProductInSessionStorage = cartProducts.find((sessionStoredCartProduct: CartProduct) => sessionStoredCartProduct.product?.id == cartProduct.product?.id);

    if (cartProductInSessionStorage == undefined) {
      cartProducts.push(cartProduct);
    } else if (cartProductInSessionStorage.count >= 100) {
      this.toastrService.danger("You can't add more than 100 copies of this item to your cart." , 'Error')
      return;
    } else {
      cartProductInSessionStorage.count += 1;
    }

    this.toastrService.success('"' + cartProduct.product?.name + '" added to cart.', 'Success');

    this.setSessionStoredCartProducts(cartProducts);
  }

}
