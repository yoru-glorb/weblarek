import { IProduct } from "../../types";

/**
 */
export class Catalog {
  private products: IProduct[]; 
  private selectedProduct: IProduct | null; 

  constructor(products: IProduct[] = []) {
    this.products = products;
    this.selectedProduct = null;
  }

  /**
   * @param products 
   */
  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  /**
   */
  getProducts(): IProduct[] {
    return this.products;
  }

  /**
   * @param id 
   */
  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  /**
   * @param product 
   */
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  /**
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
