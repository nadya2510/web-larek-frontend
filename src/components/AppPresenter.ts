import '../scss/styles.scss';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { LotItem } from './AppData';
import {
	IEvents,
	IModal,
	IAppState,
	IViewPage,
	ICardConstructor,
	IOrderConstructor,
	IContactsConstructor,
	IViewOrderFormComponent,
	IViewСontactsFormComponent,
	IViewOrder,
	IViewOrderForm,
	IViewСontactsForm,
	OrderFormsStep,
	IViewSuccessComponent,
	IViewBasketComponent,
	IBasketConstructor,
	IBasketItemConstructor,
	ISuccessConstructor,
	IAuctionAPI,
} from '../types/index';

export class AppPresenter {
	protected cardCatalogTemplate: HTMLTemplateElement;
	protected cardPreviewTemplate: HTMLTemplateElement;
	protected basketTemplate: HTMLTemplateElement;
	protected cardBasketTemplate: HTMLTemplateElement;
	protected orderTemplate: HTMLTemplateElement;
	protected contactsTemplate: HTMLTemplateElement;
	protected successTemplate: HTMLTemplateElement;
	protected basket: IViewBasketComponent;
	protected order: IViewOrderFormComponent;
	protected contacts: IViewСontactsFormComponent;
	protected success: IViewSuccessComponent;

	constructor(
		protected api: IAuctionAPI,
		protected events: IEvents,
		protected appData: IAppState,
		protected page: IViewPage,
		protected modal: IModal,
		protected cardConstructor: ICardConstructor,
		protected basketConstructor: IBasketConstructor,
		protected basketItemConstructor: IBasketItemConstructor,
		protected orderConstructor: IOrderConstructor,
		protected contactsConstructor: IContactsConstructor,
		protected successConstructor: ISuccessConstructor
	) {
		this.cardCatalogTemplate =
			ensureElement<HTMLTemplateElement>('#card-catalog');
		this.cardPreviewTemplate =
			ensureElement<HTMLTemplateElement>('#card-preview');
		this.basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
		this.cardBasketTemplate =
			ensureElement<HTMLTemplateElement>('#card-basket');
		this.orderTemplate = ensureElement<HTMLTemplateElement>('#order');
		this.contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
		this.successTemplate = ensureElement<HTMLTemplateElement>('#success');
	}

	init() {
		this.basket = new this.basketConstructor(
			cloneTemplate(this.basketTemplate),
			this.events
		);
		this.order = new this.orderConstructor(
			cloneTemplate(this.orderTemplate),
			this.events
		);
		this.contacts = new this.contactsConstructor(
			cloneTemplate(this.contactsTemplate),
			this.events
		);

		this.success = new this.successConstructor(
			cloneTemplate(this.successTemplate),
			{
				onClick: () => {
					this.modal.close();
				}
			}
		);

		// Получаем лоты с сервера
		this.api
			.getLotList()
			.then(this.appData.setCatalog.bind(this.appData))
			.catch((err) => {
				console.error(err);
			});
	}

	renderView() {
		this.page.catalog = this.appData.catalog.map((item) => {
			const card = new this.cardConstructor(
				cloneTemplate(this.cardCatalogTemplate),
				{
					onClick: () => this.events.emit('card:select', item),
				}
			);
			return card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price,
			});
		});

		this.page.counter = this.appData.getItemBasket().length;
	}

	setPreview(item: LotItem) {
		this.appData.setPreview(item);
	}

	previewCard(item: LotItem) {
		const showItem = (item: LotItem) => {
			const card = new this.cardConstructor(
				cloneTemplate(this.cardPreviewTemplate),
				{
					onClick: () => this.events.emit('card:addBasket', item),
				}
			);

			this.modal.render({
				content: card.render({
					title: item.title,
					image: item.image,
					category: item.category,
					price: item.price,
					description: item.description,
				}),
			});
		};

		if (item) {
			this.api
				.getLotItem(item.id)
				.then((result) => {
					item.description = result.description;
					showItem(item);
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			this.modal.close();
		}
	}

	addBasket(item: LotItem) {
		if (item.status !== 'closed') {
			this.appData.setStatusCardBasket(item);
		}
		this.modal.close();
	}

	openBasket() {
		this.basket.items = this.appData.getItemBasket().map((item, index) => {
			const card = new this.basketItemConstructor(
				cloneTemplate(this.cardBasketTemplate),
				this.events
			);
			return card.render({
				title: item.title,
				price: item.price,
				id: item.id,
				index: index + 1,
			});
		});
		const basketTotal = this.appData.getTotal();
		this.basket.total = basketTotal;

		this.modal.render({
			content: this.basket.render({}),
		});
	}

	delBasket(item: { id: string }) {
		const basketIt = this.appData
			.getItemBasket()
			.find((it) => it.id === item.id);
		this.appData.setStatusCardBasket(basketIt);
		this.modal.close();
		this.events.emit('basket:open');
	}

	getCountBasket() {
		this.page.counter = this.appData.getItemBasket().length;
	}
	getFormContactsErrors(errors: Partial<IViewСontactsForm>) {
		const { email, phone } = errors;
		this.contacts.valid = !email && !phone;
		this.contacts.errors = Object.values({ email, phone })
			.filter((i) => !!i)
			.join('; ');
	}

	getFormOrderErrors(errors: Partial<IViewOrderForm>) {
		const { address, payment } = errors;
		this.order.valid = !address && !payment;
		this.order.errors = Object.values({ address, payment })
			.filter((i) => !!i)
			.join('; ');
	}

	getFormOrder(
		data: { field: keyof IViewOrder; value: string },
		step: OrderFormsStep
	) {
		this.appData.setOrderField(data.field, data.value, step);
	}

	openOrder() {
		//Заполним данные заказа по лотам
		this.appData.fillOrdere();
		this.modal.render({
			content: this.order.render({
				address: '',
				valid: false,
				errors: [],
			}),
		});
	}

	orderClick() {
		this.modal.close();
		this.modal.render({
			content: this.contacts.render({
				phone: '',
				email: '',
				valid: false,
				errors: [],
			}),
		});
	}
	contactsClick() {
		this.api
			.orderLots(this.appData.order)
			.then((result) => {
				this.modal.close();
				this.appData.clearBasket();
				this.events.emit('cardStatus:changed');
				this.success.total = result.total; //this.appData.getTotal();
				this.modal.render({
					content: this.success.render({}),
				});
			})
			.catch((err) => {
				console.error(err);
			});
	}
}
