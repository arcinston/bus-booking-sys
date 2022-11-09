import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
    fname: string;
    lname: string;
    phone: string;
    nic?: string;
    address: string;
    email: string;
    password: string;
    discount: boolean;
    enabled: boolean;
    loginCount: number;
    googleId?: string;
}

const userSchema = new mongoose.Schema({
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
        required: true,
    },
    nic: {
        type: String
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    discount: {
        type: Boolean,
        required: true
    },
    enabled : {
        type: Boolean,
        required: true
    },
    loginCount : {
        type: Number,
        default: 0
    },
    googleId: {
        type : String
    }
})

export default mongoose.model<IUser>('User', userSchema)