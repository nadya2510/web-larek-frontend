import { Form } from './common/Form';
import {
	IViewOrderForm,
	IViewСontactsForm,
	IEvents,
	IViewOrderFormComponent,
	IViewСontactsFormComponent,
} from '../types';
import { ensureAllElements } from '../utils/utils';

export class Order
	extends Form<IViewOrderForm>
	implements IViewOrderFormComponent
{
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._buttons.forEach((item) => {
			//Приоткрытии не активна ни одна кнопка
			item.classList.remove('button_alt-active');
			item.addEventListener('click', (e: Event) => {
				//Слушатель
				const target = e.target as HTMLButtonElement;
				const value = target.name;
				this.onInputChange('payment', value);
				//Сброс
				this._buttons.forEach((button) => {
					button.classList.remove('button_alt-active');
				});
				//Установка
				target.classList.add('button_alt-active');
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	set payment(value: string) {
		(this.container.elements.namedItem('payment') as HTMLInputElement).value =
			value;
	}
}

export class OrderContacts
	extends Form<IViewСontactsForm>
	implements IViewСontactsFormComponent
{
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
