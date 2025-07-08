import { Component } from './base/Component';
import { IViewCard, IViewCardComponent, ICardActions } from '../types';
import { ensureElement } from '../utils/utils';

const priseNull: string = 'Бесценно';

export class Card extends Component<IViewCard> implements IViewCardComponent {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _description?: HTMLElement | null;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button?: HTMLButtonElement | null;

	constructor(protected container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);

		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, priseNull);
			if (this._button) {
				this.setDisabled(this._button, true);
			}
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}
