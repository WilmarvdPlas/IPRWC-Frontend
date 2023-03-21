import {AfterViewChecked, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {HttpService} from "../../services/http.service";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {UserService} from "../../services/user.service";
import {ProductDeleteDialogComponent} from "./product-delete-dialog/product-delete-dialog.component";

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

  constructor(private httpService: HttpService, private toastrService: NbToastrService, private userService: UserService, private dialogService: NbDialogService) {}

  ngOnInit() {
    if (this.userService.accountIsActive() && this.userService.getActiveAccount().administrator) {
      this.setProducts()
    }
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
      next: (response) => {
        response.body.sort((a: { name: String }, b: { name: String; }) => (a.name > b.name) ? 1 : -1);
        this.products = response.body
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Items could not be fetched.', 'Error');
      }
    })
  }

  openDeleteDialog(){
    this.dialogService.open(ProductDeleteDialogComponent, {context: {
        product: this.selectedProduct
      }})
      .onClose.subscribe(() => {
      this.setProducts();
    })
  }

}
