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

  products?: Product[];

  filteredProducts?: Product[] = [];

  searchFilterProducts?: Product[];
  priceFilterProducts?: Product[];

  maximumPrice = 100;
  searchString = '';
  resultsString = this.searchString;

  constructor(private httpService: HttpService, private toastrService: NbToastrService) {}

  ngOnInit() {
    this.setProducts()
  }

  setProducts() {
    this.httpService.get('product').subscribe({
      next: (response) => {
        this.products = response.body;
        this.filteredProducts = this.products;
        this.searchFilterProducts = this.products;
        this.priceFilterProducts = this.products;
      },
      error: (error) => {
        this.httpService.authorisedFilter(error.status);
        this.toastrService.danger('Items could not be fetched.', 'Error');
      }
    })
  }

  getActualPrice(product: Product) : number {
    return product?.priceEuro! - ((product?.discountPercentage! / 100) * product?.priceEuro!)
  }

  search() {
    this.searchFilterProducts = this.products?.filter((product) =>
    {
      return product.name?.toLowerCase().includes(this.searchString.toLowerCase()) || product.description?.toLowerCase().includes(this.searchString.toLowerCase())
    })
    this.resultsString = this.searchString
    this.setFilteredProducts();
  }

  filterPrice() {
    if (this.maximumPrice == 100) {
      this.priceFilterProducts = this.products;
    } else {
      this.priceFilterProducts = this.products?.filter((product) => {return this.getActualPrice(product) <=  this.maximumPrice})
    }
    this.setFilteredProducts();
  }

  setFilteredProducts() {
    this.filteredProducts = this.products?.filter((product) => {return this.priceFilterProducts?.includes(product) && this.searchFilterProducts?.includes(product)})
  }
}
