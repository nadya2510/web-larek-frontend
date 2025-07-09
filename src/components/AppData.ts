import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	LotStatus,
	ILot,
	IOrder,
	IViewOrder,
	OrderFormsStep,
} from '../types';

export type CatalogChangeEvent = {
	catalog: LotItem[];
};

export class LotItem extends Model<ILot> implements ILot {
	id: string;
	image: string;
	title: string;
	description: string;
	price: number;
	category: string;
	status: LotStatus;
}

export class AppState extends Model<IAppState> implements IAppState {
	basket: string[];
	catalog: LotItem[];
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};

	preview: string | null;
	formErrors: FormErrors = {};

	clearBasket() {
		this.catalog
			.filter((item) => item.status === 'closed')
			.forEach((item) => {
				item.status = 'active';
			});
	}

	fillOrdere() {
		this.order.items = [];
		this.catalog
			.filter((item) => item.status === 'closed')
			.forEach((item) => {
				this.order.items.push(item.id);
			});
		this.order.total = this.getTotal();		
	}

	getTotal() {
		let total = this.catalog
			.filter((item) => item.status === 'closed')
			.reduce<number>((sum, item) => sum + item.price, 0);
		return total;
	}

	setCatalog(items: ILot[]) {
		this.catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: LotItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setStatusCardBasket(item: LotItem) {
		if (item.status !== 'closed') {
			item.status = 'closed';
		} else {
			item.status = 'active';
		}

		this.emitChanges('cardStatus:changed', item);
	}

	getItemBasket(): LotItem[] {
		return this.catalog.filter((item) => item.status === 'closed');
	}

	setOrderField(field: keyof IViewOrder, value: string, step: OrderFormsStep) {
		this.order[field] = value;

		if (this.validateOrder(step)) {
			//Валидация прошла
			this.events.emit('order:ready', this.order);
			this.order.total = this.getTotal();
		}
	}

	validateOrder(step: OrderFormsStep) {
		const errors: typeof this.formErrors = {};

		if (step === 'order') {
			if (!this.order.address) {
				errors.address = 'Необходимо указать адрес';
			}
			if (!this.order.payment) {
				errors.payment = 'Необходимо указать способ оплаты';
			}
			this.formErrors = errors;
			this.events.emit('formOrderErrors:change', this.formErrors);
		}

		if (step === 'contacts') {
			if (!this.order.email) {
				errors.email = 'Необходимо указать email';
			}
			if (!this.order.phone) {
				errors.phone = 'Необходимо указать телефон';
			}

			this.formErrors = errors;
			this.events.emit('formContactsErrors:change', this.formErrors);
		}

		return Object.keys(errors).length === 0;
	}
}
