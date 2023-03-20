import {AfterViewChecked, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {HttpService} from "../../services/http.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements AfterViewChecked, OnInit {

  @ViewChildren(ProductEditComponent) productEditComponents?: QueryList<ProductEditComponent>;
  createProductComponent: any;
  editProductComponent: any;

  editingProduct = false;

  products?: Product[];
  selectedProduct?: Product;

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  ngOnInit() {
    this.setProducts()
  }

  ngAfterViewChecked() {
    this.createProductComponent = this.productEditComponents?.toArray()[0];
    this.editProductComponent = this.productEditComponents?.toArray()[1];
  }

  createPostAllowed() {
    return this.createProductComponent == null ? false : this.createProductComponent.postAllowed();
  }

  editPostAllowed() {
    return this.editProductComponent == null ? false : this.editProductComponent.postAllowed();
  }

  createProduct() {
    this.createProductComponent.save();
  }

  cancelProduct() {
    this.createProductComponent?.clear();
  }

  editProduct(product: Product) {
    this.editProductComponent.product = product;
    this.editProductComponent.addedStock = 0;
    this.editingProduct = true;
  }

  saveEditedProduct() {
    this.editProductComponent.save();
    this.editingProduct = false;
  }

  setProducts() {
    this.httpService.get('product').subscribe({
      next: (response) => { this.products = response.body },
      error: () => { this.toastrService.danger('Items could not be fetched.', 'Error'); }
    })
  }

  deleteProduct() {
    this.selectedProduct!.archived = true;
    this.httpService.post('product', this.selectedProduct).subscribe({
      next: () => {
        this.toastrService.success('Product has been deleted.', 'Success');
        this.setProducts();
      },
      error: () => { this.toastrService.danger('Product could not be deleted.', 'Error'); }
    })
  }


}
