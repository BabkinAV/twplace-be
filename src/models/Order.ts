import { Schema, model, Types } from 'mongoose';
import { IProduct } from '../types';

export interface IOrder {
  products: { product: IProduct; quantity: number }[];
  userId: Types.ObjectId;
}

const orderSchema = new Schema<IOrder>({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export const Order = model<IOrder>('Order', orderSchema);
