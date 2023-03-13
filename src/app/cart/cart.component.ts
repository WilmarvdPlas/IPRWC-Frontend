import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product.model";
import {HttpService} from "../services/http.service";
import {UserService} from "../services/user.service";
import {NbToastrService} from "@nebular/theme";
import {CartProduct} from "../models/cart-product.model";
import {lastValueFrom} from "rxjs";
import {Transaction} from "../models/transaction.model";
import {TransactionProduct} from "../models/transaction-product.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartProducts: CartProduct[] = [];
  products: Product[] = []
  cartProductsCountArray: number[] = [];

  fullPriceProducts: number = 0;
  productCount: number = 0;

  constructor(private httpService: HttpService, private userService: UserService, private toastrService: NbToastrService) {}

  ngOnInit() {
    this.setProducts();
  }

  setProducts() {
    this.httpService.get('cart_product/account=' + this.userService.getActiveAccount()?.id).subscribe({
      next: (response) => {
        response.body.sort((a: { product: Product }, b: { product: Product; }) => (a.product.name! > b.product.name!) ? 1 : -1);
        this.cartProducts = [];
        this.products = [];
        this.cartProductsCountArray = [];

        this.cartProducts = response.body;

        this.copyToProductsArray(response.body);
        this.setFullPriceProducts(response.body);
        this.setProductCount(response.body);
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
    if(await this.sufficientStock()) {
      this.postTransaction()
    }
  }

  async sufficientStock() {
    for (let cartProduct of this.cartProducts) {

      let response = await lastValueFrom(this.httpService.get('product/' + cartProduct.product?.id))
      let product: Product = response.body;
      if (product.stock! < cartProduct.count!) {
        this.toastrService.danger('Helaas, wij hebben maar ' + product.stock + ' exemplaren van "' + product.name + '" op voorraad.', 'Niet genoeg voorraad')
        return false;
      }
    }
    return true;
  }

  postTransaction() {
    let transaction = new Transaction(undefined, this.userService.getActiveAccount())
    this.httpService.post('transaction', transaction).subscribe({
      next: (response) => {
        this.postTransactionProducts(response.body);
        this.toastrService.success('Bestelling is succesvol geplaatst.', 'Succes');
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
        next: (response) => { console.log(response); },
        error: (error) => { console.log(error) }
      })
    }
  }


}
