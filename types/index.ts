export interface productCategory {
  id: string;
  categoryName: string;
  categoryImg: { categoryImagePath: string; altImageText: string };
}

export interface Product {
	id: string,
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
	product: Product,
	quantity: number
}


export enum Size {
	S = 'S',
	M = 'M',
	L = 'L',
	XL = 'XL'

}
