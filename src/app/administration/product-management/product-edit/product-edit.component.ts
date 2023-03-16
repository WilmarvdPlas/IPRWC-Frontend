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
    if (this.allFieldsFilled()) {
      this.postProduct()
    }
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
      error: () => {
        this.toastrService.danger('Product could not be saved.', 'Error');
        this.setProducts.emit();
      }
    })
  }

  postStock(id: string, addedStock: number) {
    if (addedStock > 0) {
      this.httpService.put('product/' + id + "/edit_stock", addedStock).subscribe({
        next: () => {
          this.toastrService.success('Stock has been changed.', 'Success');
          this.setProducts.emit();
        },
        error: () => {
          this.toastrService.danger('Stock could not be changed.', 'Error');
          this.setProducts.emit();
        }
      })
    }
  }

}
