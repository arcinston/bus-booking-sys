import mongoose,{ Document } from 'mongoose';
//IAdmin is the interface for the admin model
export interface IAdmin extends Document {
   fname : string;
    lname : string;
    phone : string;
    nic : string;
    address : string;
    email : string;
    password : string;
    enabled : boolean;
}

const adminSchema = new mongoose.Schema({
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
    enabled: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model<IAdmin>('Admin', adminSchema);