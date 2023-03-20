import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {HttpService} from "../../services/http.service";
import {ActivatedRoute} from "@angular/router";
import {CartProduct} from "../../models/cart-product.model";
import {NbToastrService} from "@nebular/theme";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  product?: Product;
  routeProductId?: string;

  constructor(private httpService: HttpService, private route: ActivatedRoute, private toastrService: NbToastrService, private userService: UserService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeProductId = params['id'];
      this.setProduct();
    })
  }

  setProduct() {
    this.httpService.get('product/' + this.routeProductId).subscribe({
      next: (response) => { this.product = response.body; },
      error: (error) => { this.httpService.authorisedFilter(error.status); }
    })
  }

  addProductToCart() {
    let cartProduct = new CartProduct(undefined, 1, this.product, this.userService.getActiveAccount());

    this.httpService.post('cart_product', cartProduct).subscribe({
      next: () => { this.toastrService.success('"' + this.product?.name + '" added to cart.', 'Success'); },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        error.status == 406
          ? this.toastrService.danger("You can't add more than 100 copies of this item to your cart." , 'Error')
          : this.toastrService.danger('Item could not be added to cart.', 'Error');
      }
    })
  }

}
