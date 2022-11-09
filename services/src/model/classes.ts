import mongoose from 'mongoose'

export interface IClass extends mongoose.Document {
name: string;
fairRatio: number;
}

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fairRatio: {
        type: Number,
        required: true,
    }
})

export default mongoose.model<IClass>('Class', classSchema)