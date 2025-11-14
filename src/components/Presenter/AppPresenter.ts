import { Api } from '../base/Api';
import { Communication } from '../Models/Communication';
import { Catalog } from "../Models/Catalog";
import { Cart } from "../Models/Cart";
import { Buyer } from "../Models/Buyer";
import { API_URL, categoryMap } from "../../utils/constants";
import { ModalView } from '../Views/ModalView';
import { ProductPreviewView } from '../Views/ProductPreviewView';
import { CatalogView } from '../Views/CatalogView';
import { CartView } from '../Views/CartView';
import { OrderFormView } from '../Views/OrderFormView';
import { ContactsFormView } from '../Views/ContactsFormView';
import { SuccessView } from '../Views/SuccessView';
import { IProduct, OrderNextPayload } from '../../types';
import { events } from '../base/Events';
import { BasketCounterView } from '../Views/BasketCounterView';
import { EventNames } from '../../utils/utils';
import { toCardViewData, toCartItemData } from '../../utils/mappers';

export class AppPresenter {
  private catalog = new Catalog();
  private cart = new Cart();
  private buyer = new Buyer();

  private api = new Api(API_URL);
  private communication = new Communication(this.api);

  private catalogView = new CatalogView('.gallery');
  private cartView = new CartView();
  private modal = new ModalView('#modal-container');

  private normalizeCategory(raw: string): string {
    return categoryMap[raw]?.mod || 'other';
  }
  public init() {
    this.loadProducts();
    this.initEvents();
    this.updateBasketCounter();
  }
  private async loadProducts() {
    try {
      const productlist = await this.communication.getProductList();
      this.catalog.setProducts(productlist);
      this.catalogView.render(toCardViewData(productlist));
      this.catalogView.render(toCardViewData(productlist));
    } catch (err) {
      console.error('Ошибка загрузки каталога:', err);
    }
  }

  private initEvents() {
   events.on<{ id: string }>('card:select', ({ id }) => {
  const product = this.catalog.getProductById(id);
  if (!product) return;

      const normalizedProduct = {
        ...product,
        category: this.normalizeCategory(product.category),
      };

      const previewView = new ProductPreviewView();
      previewView.setCartChecker((pid) => this.cart.hasItem(pid));
      const inCart = this.cart.hasItem(product.id);
      this.modal.open(previewView.render(normalizedProduct, inCart));
    });
    const basketButton = document.querySelector<HTMLButtonElement>('.header__basket');
    if (basketButton) {
      basketButton.addEventListener('click', () => {
        this.modal.open(this.cartView.getElement());
      });
    }

   events.on<IProduct>('cart:add', (product) => {
    this.cart.addItem(product);
   this.cartView.render(toCartItemData(this.cart.getItems()));
    this.updateBasketCounter();
    events.emit('cart:changed');
  });

  events.on<{ index: number }>('cart:remove', ({ index }) => {
    const items = this.cart.getItems();
    items.splice(index, 1);

    this.cart.clear();
    items.forEach(item => this.cart.addItem(item));

    this.cartView.render(toCartItemData(this.cart.getItems()));
    this.updateBasketCounter();
    events.emit('cart:changed');
  });
events.on<{ id: string }>('cart:remove-by-id', ({ id }) => {
  this.cart.removeItem({ id } as any);
  this.cartView.render(toCartItemData(this.cart.getItems()));
  this.updateBasketCounter();
  events.emit('cart:changed');
});
  events.on('cart:order', () => {
    const orderForm = new OrderFormView(this.buyer.getData());
    this.modal.open(orderForm.getElement());
  });

  events.on<OrderNextPayload>(EventNames.OrderNext, ({ payment, address }) => {
  this.buyer.setData({ payment, address });
  const contactsForm = new ContactsFormView();
  this.modal.open(contactsForm.getElement());
});
  events.on<{ email: string; phone: string }>('order:confirm', async ({ email, phone }) => {
    this.buyer.setData({ email, phone });

      const order = {
        ...this.buyer.getData(),
        items: this.cart.getItems().map((p) => p.id),
        total: this.cart.getTotalPrice(),
      };

      try {
        const result: { total: number } = await this.communication.sendOrder(order);
        const success = new SuccessView();
        this.modal.open(success.render(result.total));

        this.cart.clear();
        this.cartView.render([]);
        this.updateBasketCounter();
      } catch (err) {
        console.error('Ошибка при заказе:', err);
      }
    });
  events.on('success:close', () => {
    this.modal.close();
  });
  }
 private basketCounter = new BasketCounterView();
 private updateBasketCounter() {
  this.basketCounter.update(this.cart.getCount());
}
}
