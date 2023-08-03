import { Schema, model } from 'mongoose';
import { IOrder } from '../types';
import { ProductSchema } from './Product';



const orderSchema = new Schema<IOrder>({
  products: [
    {
      product: ProductSchema,
			refProductId: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'Order',
			},
      quantity: { type: Number, required: true },
			_id: false
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

}, {timestamps: true});

export const Order = model<IOrder>('Order', orderSchema);
