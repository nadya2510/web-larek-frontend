export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}
export interface IModalData {
	content: HTMLElement;
}

export interface IModal {
	content: HTMLElement;
	open: () => void;
	close: () => void;
	render: (data: IModalData) => HTMLElement;
}

export interface IComponent<T> {
	toggleClass: (
		element: HTMLElement,
		className: string,
		force?: boolean
	) => void;
	addClass: (element: HTMLElement, className: string) => void;
	removeClass: (element: HTMLElement, className: string) => void;
	setDisabled: (element: HTMLElement, state: boolean) => void;
	render(data?: Partial<T>): HTMLElement; // метод рендера
}
export interface IForm<T> {
	valid: boolean;
	errors: string;
	render(state: Partial<T> & IFormState): HTMLElement; // метод рендера
}

export interface ILot {
	id: string;
	image: string;
	title: string;
	description: string;
	category: string;
	price: number | null;
	status: LotStatus;
}

export type LotStatus = 'active' | 'closed';

export interface IAppState {
	catalog: ILot[];	
	preview: string | null;
	order: IOrder | null;
	clearBasket: () => void;
	fillOrdere: () => void;
	getTotal: () => number;
	setCatalog: (items: ILot[]) => void;
	setPreview: (item: ILot) => void;
	setStatusCardBasket: (item: ILot) => void;
	getItemBasket: () => ILot[];
	setOrderField: (
		field: keyof IViewOrder,
		value: string,
		step: OrderFormsStep
	) => void;
	validateOrder: (step: OrderFormsStep) => boolean;
}

export interface IViewPage {
	counter: number;
	catalog: HTMLElement[];
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IViewCard {
	title: string;
	category: string;
	price: number | null;
	image: string;
	description: string | null;
}

export interface IViewCardComponent extends IViewCard, IComponent<IViewCard> {}

export interface ICardConstructor {
	new (container: HTMLElement, actions?: ICardActions): IViewCardComponent;
}

export interface IViewBasket {
	items: HTMLElement[];
	total: number;
}

export interface IViewBasketComponent
	extends IViewBasket,
		IComponent<IViewBasket> {}

export interface IBasketConstructor {
	new (container: HTMLElement, events: IEvents): IViewBasketComponent;
}

export interface IViewBasketItem {
	id: string;
	index: number;
	title: string;
	price: number;
}

export interface IViewBasketItemComponent
	extends IViewBasketItem,
		IComponent<IViewBasketItem> {}

export interface IBasketItemConstructor {
	new (container: HTMLElement, events: IEvents): IViewBasketItemComponent;
}

export interface IViewOrderForm {
	payment: string;
	address: string;
}

export interface IViewOrderFormComponent
	extends IViewOrderForm,
		IForm<IViewOrderForm> {}

export interface IOrderConstructor {
	new (container: HTMLFormElement, events: IEvents): IViewOrderFormComponent;
}

export interface IViewСontactsForm {
	email: string;
	phone: string;
}

export interface IViewСontactsFormComponent
	extends IViewСontactsForm,
		IForm<IViewСontactsForm> {}
export interface IContactsConstructor {
	new (container: HTMLFormElement, events: IEvents): IViewСontactsFormComponent;
}

export interface IViewOrder extends IViewOrderForm, IViewСontactsForm {}

export interface IOrder extends IViewOrder {
	total: number;
	items: string[];
}

export type FormErrors = Partial<Record<keyof IViewOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IAuctionAPI {
	getLotList: () => Promise<ILot[]>;
	getLotItem: (id: string) => Promise<ILot>;
	orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};
export type OrderFormsStep = 'order' | 'contacts';

export interface IViewSuccess {
	total: number;
}

export interface IViewSuccessComponent
	extends IViewSuccess,
		IComponent<IViewSuccess> {}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ISuccessConstructor {
	new (container: HTMLElement, actions: ISuccessActions): IViewSuccessComponent;
}
