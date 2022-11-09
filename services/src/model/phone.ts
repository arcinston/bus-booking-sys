import mongoose from 'mongoose'

export interface IPhone extends mongoose.Document {
    phone: string;
    pin: string;
}

const phoneSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    }
})

export default mongoose.model<IPhone>('Phone', phoneSchema)