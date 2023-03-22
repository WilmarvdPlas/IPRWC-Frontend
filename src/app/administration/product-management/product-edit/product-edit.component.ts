import {Component, EventEmitter, Output} from '@angular/core';
import {HttpService} from "../../../services/http.service";
import {Product} from "../../../models/product.model";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent {

  @Output() setProducts = new EventEmitter();

  product: Product = new Product(undefined, '', '', undefined, '', 0, 0);
  addedStock = 0;

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  save() {
    if (this.postAllowed()) {
      this.postProduct()
    }
  }

  postAllowed() {
    return this.allFieldsFilled() && this.validDiscount() && this.validPrice() && this.validStock();
  }

  validDiscount() {
    return this.product.discountPercentage == undefined ? false : this.product.discountPercentage >= 0 && this.product.discountPercentage <= 100
  }

  validPrice() {
    return this.product.priceEuro == undefined ? false : this.product.priceEuro >= 0.01;
  }

  validStock() {
    return this.addedStock == undefined ? false : this.addedStock >= 0;
  }

  clear() {
    this.product = new Product(undefined, '', '', undefined, '', 0, 0);
    this.addedStock = 0;
    this.setProducts.emit();
  }

  allFieldsFilled() {
    return this.product.name != ''
      && this.product.priceEuro != undefined
      && this.product.description != ''
      && this.product.imageLink != ''
      && this.product.stock != undefined
      && this.product.discountPercentage != undefined
      && this.addedStock != undefined;
  }

  postProduct() {
    this.httpService.post('product', this.product).subscribe({
      next: (response) => {
        this.toastrService.success('Product has been saved.', 'Success');
        this.postStock(response.body, this.addedStock)
        this.setProducts.emit();
        this.clear();
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Product could not be saved.', 'Error');
        this.setProducts.emit();
      }
    })
  }

  postStock(id: string, addedStock: number) {
    this.httpService.put('product/' + id + "/edit_stock", addedStock).subscribe({
      next: () => {
        this.toastrService.success('Stock has been changed.', 'Success');
        this.setProducts.emit();
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Stock could not be changed.', 'Error');
        this.setProducts.emit();
      }
    })
  }
}
