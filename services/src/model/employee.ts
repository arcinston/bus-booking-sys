import mongoose from 'mongoose'

export interface IEmployee extends mongoose.Document {
    firstname?: string;
    lastname?: string;
    nic?: string;
    address?: string;
}

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: 'String'
    },
    lastName: {
        type: 'String'
    },
    nic: {
        type: 'String'
    },
    address: {
        type: 'String'
    }
})

export default mongoose.model<IEmployee>('Employee', employeeSchema)