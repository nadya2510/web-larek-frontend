import { Component } from './base/Component';
import { createElement, ensureElement } from '../utils/utils';
import {
	IViewBasket,
	IViewBasketItem,
	IViewBasketItemComponent,
	IViewBasketComponent,
	IEvents,
} from '../types';
export class Basket
	extends Component<IViewBasket>
	implements IViewBasketComponent
{
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		let totalFormat = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
		this.setText(this._total, `${totalFormat} синапсов`);
		if (total === 0) {
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}
	}
}

export class BasketItem
	extends Component<IViewBasketItem>
	implements IViewBasketItemComponent
{
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteButton: HTMLButtonElement;
	protected _id: string;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._index = container.querySelector('.basket__item-index');
		this._title = container.querySelector('.card__title');
		this._price = container.querySelector('.card__price');
		this._deleteButton = container.querySelector('.basket__item-delete');
		this._deleteButton.addEventListener('click', () => {
			this.events.emit('card:delBasket', { id: this._id });
		});
	}

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id || '';
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		let valueFormat = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
		this.setText(this._price, `${valueFormat} синапсов`);
	}

	set index(value: number) {
		this.setText(this._index, `${value}`);
	}
}
