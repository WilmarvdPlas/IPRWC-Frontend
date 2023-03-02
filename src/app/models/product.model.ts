export class Product {

  id?: string;
  name?: string;
  price?: number;
  image?: string;
  stock?: number;
  discountPercentage?: number;
  dateCreated?: Date;

  constructor(id?: string, name?: string, price?: number, image?: string, stock?: number, discountPercentage?: number, dateCreated?: Date) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.stock = stock;
    this.discountPercentage = discountPercentage;
    this.dateCreated = dateCreated;
  }

}
