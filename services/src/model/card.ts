import mongoose from 'mongoose'

export interface ICard extends mongoose.Document {
    card: string;
    cvv: string;
    exp: string;
    amount: number;
}

const cardSchema = new mongoose.Schema({
    card: {
        type: String,
        required: true,
    },
    cvc: {
        type: String,
        required: true,
    },
    exp: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
})

export default mongoose.model<ICard>('Card', cardSchema)