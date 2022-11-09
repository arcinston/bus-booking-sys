import mongoose from 'mongoose';

export interface IReservation extends mongoose.Document {
  user: string;
  from: string;
  to: string;
  train: string;
  trainClass: string;
  time: string;
  qty: number;
  date: string;
  amount: number;
  discount: number;
  total: number;
  paymentMethod: string;
  card?: string;
  phone?: string;
  email?: string;
}

const reservationSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  train: {
    type: String,
    required: true,
  },
  trainClass: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  card: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
});

export default mongoose.model<IReservation>('Reservation', reservationSchema);
