import mongoose from 'mongoose'

export interface ITrain extends mongoose.Document {
    name: string;
    route: string;
    classes: string[];
}

const trainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    },
    classes:{
        type: Array,
        required: true
    }
})

 export default mongoose.model<ITrain>('Train', trainSchema)