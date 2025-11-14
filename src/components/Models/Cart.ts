import { IProduct } from '../../types/index.ts';

export class Cart {
  private items: IProduct[]; 

  /**
   * 
   * @param items 
   */
  constructor(items: IProduct[] = []) {
    this.items = items;
  }

  /**
   * @returns 
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * @param product 
   */
  addItem(product: IProduct): void {
    this.items.push(product);
  }

  /**
   * @param product
   */
  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
  }

  /**
   */
  clear(): void {
    this.items = [];
  }

  /**
   * @returns 
   */
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /**
   * @returns 
   */
  getCount(): number {
    return this.items.length;
  }

  /**
   * @param productId 
   * @returns
   */
  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}
