import mongoose from 'mongoose';
import  'colors'

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(process.env.MONGO_URI!);

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
};

export default connectDB;
