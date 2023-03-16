import {Component, OnInit} from '@angular/core';
import {HttpService} from "../services/http.service";
import {Product} from "../models/product.model";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products?: Product[]
  filteredProducts?: Product[]

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  ngOnInit() {
    this.setProducts()
  }

  setProducts() {
    this.httpService.get('product').subscribe({
      next: (response) => { this.products = response.body; this.filteredProducts = this.products; },
      error: () => { this.toastrService.danger('Items could not be fetched.', 'Error'); }
    })
  }
}
