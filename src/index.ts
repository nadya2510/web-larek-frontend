import './scss/styles.scss';
import { AuctionAPI } from './components/AuctionAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent, LotItem } from './components/AppData';
import { IViewOrderForm, IViewСontactsForm, IViewOrder	} from './types/index';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket, BasketItem } from './components/Basket';
import { Card } from './components/Card';
import { Order, OrderContacts } from './components/Order';
import { Success } from './components/Success';
import { AppPresenter } from './components/AppPresenter';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);
// Модель данных приложения
const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const appPresenter = new AppPresenter(api, events, appData, page, modal, Card, Basket, BasketItem, Order, OrderContacts, Success);

appPresenter.init();

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	appPresenter.renderView();	
});

// Открыть лот
events.on('card:select', (item: LotItem) => {
	appPresenter.setPreview(item);	//
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: LotItem) => {
	appPresenter.previewCard(item);
});

// Добавили лот в корзину
events.on('card:addBasket', (item: LotItem) => {
	appPresenter.addBasket(item);

});

// Открыть казину
events.on('basket:open', (item: LotItem) => {
	appPresenter.openBasket();	
});

// Удалили лот из корзины
events.on('card:delBasket', (item: { id: string }) => {
	appPresenter.delBasket({ id: item.id });	
});

//Изменился статус лот
events.on('cardStatus:changed', () => {
  appPresenter.getCountBasket();	
});


// Изменилось состояние валидации формы
events.on('formContactsErrors:change', (errors: Partial<IViewСontactsForm>) => {
  appPresenter.getFormContactsErrors(errors); 	
	
});

// Изменилось состояние валидации формы
events.on('formOrderErrors:change', (errors: Partial<IViewOrderForm>) => {
   appPresenter.getFormOrderErrors(errors); 		
});


// Изменилось одно из полей формы шаг1
events.on(	
	/^order\..*:change/,
	(data: { field: keyof IViewOrder; value: string }) => {		
		appPresenter.getFormOrder(data,'order'); 		
	}
);

// Изменилось одно из полей формы шаг2
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IViewOrderForm; value: string }) => {		
		appPresenter.getFormOrder(data, 'contacts');		
	}
);


// Открыть форму заказа
events.on('order:open', () => {
	appPresenter.openOrder();	
});

// Отправлена форма заказа шаг1
events.on('order:submit', () => {
	appPresenter.orderClick();
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
  appPresenter.contactsClick()
});

