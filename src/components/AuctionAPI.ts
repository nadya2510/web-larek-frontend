import { Api } from './base/api';
import {
	IOrder,
	IOrderResult,
	ILot,
	IAuctionAPI,
	ApiListResponse,
} from '../types';

export class AuctionAPI extends Api implements IAuctionAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getLotItem(id: string): Promise<ILot> {
		return this.get(`/product/${id}`).then((item: ILot) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getLotList(): Promise<ILot[]> {
		return this.get('/product').then((data: ApiListResponse<ILot>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderLots(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
