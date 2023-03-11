import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product.model";
import {HttpService} from "../services/http.service";
import {UserService} from "../services/user.service";
import {NbToastrService} from "@nebular/theme";
import {CartProduct} from "../models/cart-product.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  products: Product[] = []
  cartProductsCountArray: number[] = [];

  constructor(private httpService: HttpService, private userService: UserService, private toastrService: NbToastrService) {}

  ngOnInit() {
    this.setProducts();
  }

  setProducts() {
    this.httpService.get('cart_product/account=' + this.userService.getActiveAccount()?.id).subscribe({
      next: (response) => {
        this.products = [];
        this.cartProductsCountArray = [];
        this.copyToProductsArray(response.body);
      },
      error: () => { this.toastrService.danger('Producten in winkelwagen konden niet opgehaald worden.', 'Error'); }
    })
  }

  copyToProductsArray(cartProducts: CartProduct[]) {
    cartProducts.forEach((cartProduct) => {
      this.products.push(cartProduct.product!);
      this.cartProductsCountArray.push(cartProduct.count!);
    });
  }



}
