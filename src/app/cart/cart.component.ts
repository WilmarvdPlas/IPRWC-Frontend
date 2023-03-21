import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product.model";
import {HttpService} from "../services/http.service";
import {UserService} from "../services/user.service";
import {NbToastrService} from "@nebular/theme";
import {CartProduct} from "../models/cart-product.model";
import {lastValueFrom} from "rxjs";
import {Transaction} from "../models/transaction.model";
import {TransactionProduct} from "../models/transaction-product.model";
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartProducts: CartProduct[] = [];
  products: Product[] = []
  cartProductsCountArray: number[] = [];

  postageCosts: number = 0;
  fullPriceProducts: number = 0;
  productCount: number = 0;

  constructor(private httpService: HttpService, private userService: UserService, private toastrService: NbToastrService, private cartService: CartService) {}

  ngOnInit() {
    this.setProducts();
  }

  setProducts() {
    if (this.userService.accountIsActive()) {
      this.httpSetProducts();
    } else {
      this.sessionStorageSetProducts();
    }
  }

  httpSetProducts() {
    this.httpService.get('cart_product/account=' + this.userService.getActiveAccount()?.id).subscribe({
      next: (response) => {
        response.body.sort((a: { product: Product }, b: { product: Product; }) => (a.product.name! > b.product.name!) ? 1 : -1);
        this.emptyArrays();
        this.cartProducts = response.body;
        this.setDetails();
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Items in cart could not be fetched.', 'Error');
      }
    })
  }

  setDetails() {
    this.postageCosts = this.cartProducts.length > 0 ? 3.99 : 0;
    this.copyToProductsArray(this.cartProducts);
    this.setFullPriceProducts(this.cartProducts);
    this.setProductCount(this.cartProducts);
  }

  emptyArrays() {
    this.cartProducts = [];
    this.products = [];
    this.cartProductsCountArray = [];
  }

  sessionStorageSetProducts() {
    this.emptyArrays();
    this.cartProducts = this.cartService.getSessionStoredCartProducts();
    this.setDetails();
  }

  copyToProductsArray(cartProducts: CartProduct[]) {
    cartProducts.forEach((cartProduct) => {
      this.products.push(cartProduct.product!);
      this.cartProductsCountArray.push(cartProduct.count!);
    });
  }

  setProductCount(cartProducts: CartProduct[]) {
    this.productCount = 0;
    for (let cartProduct of cartProducts) {
      this.productCount += cartProduct.count!;
    }
  }

  setFullPriceProducts(cartProducts: CartProduct[]) {
    this.fullPriceProducts = 0;
    for (let cartProduct of cartProducts) {
      this.fullPriceProducts += (cartProduct.product?.priceEuro! - ((cartProduct.product?.discountPercentage! / 100) * cartProduct.product?.priceEuro!)) * cartProduct.count!
    }
  }

  async toPayment() {
    if (!this.userService.accountIsActive()) {
      this.toastrService.danger('You must be logged in to check out.', 'Error');
      return;
    }

    if(await this.sufficientStock()) {
      this.postTransaction()
    }
  }

  async sufficientStock() {
    for (let cartProduct of this.cartProducts) {

      let response = await lastValueFrom(this.httpService.get('product/' + cartProduct.product?.id))
      let product: Product = response.body;
      if (product.stock! < cartProduct.count!) {
        this.toastrService.danger('Unfortunately, we do not have enough copies of "' + product.name + '" in stock.', 'Insufficient stock')
        return false;
      }
    }
    return true;
  }

  postTransaction() {
    let transaction = new Transaction(undefined, this.userService.getActiveAccount())
    this.httpService.post('transaction', transaction).subscribe({
      next: (response) => {
        this.postTransactionProducts(response.body)
        this.toastrService.success('Order has been placed.', 'Success');
      }
    })
  }

  postTransactionProducts(transactionId: string) {
    let transaction = new TransactionProduct(transactionId);

    for (let cartProduct of this.cartProducts) {
      let transactionProduct = new TransactionProduct(
        undefined,
        transaction,
        cartProduct.product,
        cartProduct.count,
        (cartProduct.product?.priceEuro! - ((cartProduct.product?.discountPercentage! / 100) * cartProduct.product?.priceEuro!)) * cartProduct.count!,
        false);

      this.httpService.post('transaction_product', transactionProduct).subscribe({
        next: () => {
          this.deleteCartProduct(cartProduct).then(() => {
            this.setProducts();
          });
        },
        error: (error) => {
          this.httpService.authorisedFilter(error.status);
        }
      })
    }
  }

  async deleteCartProduct(cartProduct: CartProduct) {
    await lastValueFrom(this.httpService.delete('cart_product/' + cartProduct.id + '/buy_product'))
  }
}
