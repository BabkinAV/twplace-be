import { Schema, model, Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = model<IUser>('User', userSchema);
