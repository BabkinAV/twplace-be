import { Types } from "mongoose";

export interface productCategory {
  _id: string;
  categoryName: string;
  categoryImg: { categoryImagePath: string; altImageText: string };
}

interface DocumentResult<T> {
	_doc: T;
}

export interface IProduct extends DocumentResult<IProduct> {
	_id: Types.ObjectId,
	title: string,
	price: {
		priceCurrent: number,
		priceOld?: number,
		discount?: number
	},
	imageLink: string,
	color: string,
	size: Size
}

export interface CartProduct  {
	product: IProduct,
	quantity: number
}


export enum Size {
	S = 'S',
	M = 'M',
	L = 'L',
	XL = 'XL'

}
