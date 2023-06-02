import { Types } from "mongoose";

export interface productCategory {
  _id: string;
  categoryName: string;
  categoryImg: { categoryImagePath: string; altImageText: string };
}

export interface IProduct {
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
