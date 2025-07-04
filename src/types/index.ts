
export interface ILot {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price:number|null;
    status: LotStatus;
}



export type LotStatus = 'active' | 'closed';

export interface IAppState {
    catalog: ILot[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;  
}


export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string; 
    category:string;
    price: number|null;
    image: string;   
    description: string; 
}

export interface IBasketView {   
    items: HTMLElement[];
    total: number;    
}

export interface IBasketItem {
    id: string;
    index: number;
    title: string;  
    price: number 

}

export interface IOrderFormStep1 {
    payment: string;   
    address: string;    
}
export interface IOrderFormStep2 {
    email: string;
    phone: string;    
}

export interface IOrderForm  extends IOrderFormStep1, IOrderFormStep2{}

export interface IOrder  extends IOrderForm{ 
    total: number;  
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;


export interface IOrderResult {
    id: string;
    total: number;
}

export type OrderFormsStep = 'order'|'contacts';

export interface IAuctionAPI {
    getLotList: () => Promise<ILot[]>;
    getLotItem: (id: string) => Promise<ILot>;   
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}

