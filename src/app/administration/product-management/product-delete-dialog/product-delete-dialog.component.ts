import { Component } from '@angular/core';
import {Product} from "../../../models/product.model";
import {NbDialogRef, NbToastrService} from "@nebular/theme";
import {HttpService} from "../../../services/http.service";

@Component({
  selector: 'app-product-delete-dialog',
  templateUrl: './product-delete-dialog.component.html',
  styleUrls: ['./product-delete-dialog.component.scss']
})
export class ProductDeleteDialogComponent {

  product?: Product;

  constructor(private dialogRef: NbDialogRef<ProductDeleteDialogComponent>, private httpService: HttpService, private toastrService: NbToastrService) {}

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.deleteProduct();
  }

  deleteProduct() {
    this.product!.archived = true;
    this.httpService.post('product', this.product).subscribe({
      next: () => {
        this.dialogRef.close();
        this.toastrService.success('Product has been deleted.', 'Success');
      },
      error: (error) => {
        this.dialogRef.close();
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Product could not be deleted.', 'Error');
      }
    })
  }
}
