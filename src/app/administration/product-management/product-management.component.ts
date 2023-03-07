import {AfterViewChecked, Component, QueryList, ViewChildren} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductEditComponent} from "./product-edit/product-edit.component";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements AfterViewChecked {

  @ViewChildren(ProductEditComponent) productEditComponents?: QueryList<ProductEditComponent>;
  createProductComponent: any;
  editProductComponent: any;

  selectedProduct?: Product;

  ngAfterViewChecked() {
    this.createProductComponent = this.productEditComponents?.toArray()[0];
    this.editProductComponent = this.productEditComponents?.toArray()[1];
  }

  createProduct() {
    this.createProductComponent.save();
  }

  cancelProduct() {
    this.createProductComponent?.clear();
  }

}
