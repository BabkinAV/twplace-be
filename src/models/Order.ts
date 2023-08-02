import { Schema, model, Types } from 'mongoose';
import { IProduct } from '../types';
import { ProductSchema } from './Product';


export interface IOrder {
  products: {
    product: IProduct & { productId: Types.ObjectId };
    quantity: number;
  }[];
  userId: Types.ObjectId;
}

const orderSchema = new Schema<IOrder>({
  products: [
    {
      product: ProductSchema,
			refId: Types.ObjectId,
      quantity: { type: Number, required: true },
			_id: false
    },
  ],
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   ref: 'User',
  // },
});

export const Order = model<IOrder>('Order', orderSchema);
