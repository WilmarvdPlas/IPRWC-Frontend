export class Product {

  id?: string;
  name?: string;
  description?: string;
  priceEuro?: number;
  image?: string;
  stock?: number;
  discountPercentage?: number;
  archived?: boolean;
  dateCreated?: Date;

  constructor(id?: string, name?: string, description?: string, priceEuro?: number, image?: string, stock?: number, discountPercentage?: number, archived?: boolean, dateCreated?: Date) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priceEuro = priceEuro;
    this.image = image;
    this.stock = stock;
    this.discountPercentage = discountPercentage;
    this.archived = archived;
    this.dateCreated = dateCreated;
  }

}
