import { Schema, model } from 'mongoose';
import { IProduct } from '../types';

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  imageLink: { type: String, required: true },
  price: {
    priceCurrent: { type: Number, required: true },
    priceOld: { type: Number, required: false },
    discount: { type: Number, required: false },
  },
  color: { type: String, required: true },
  size: { type: String, required: true, enum: ['S', 'M', 'L', 'XL'] },
});


export const Product = model<IProduct>('Product', ProductSchema);
