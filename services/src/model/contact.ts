import mongoose from 'mongoose'

export interface IContact extends mongoose.Document {
    fname: string;
    lname: string;
    phone: string;
    email: string;
    message: string;
}

const contactSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
})

export default mongoose.model<IContact>('Contact', contactSchema)