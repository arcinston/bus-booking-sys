import mongoose from 'mongoose'

type TRoute ={
    name: string;
    fair: number;
}

export interface IRoute extends mongoose.Document {
    name: string;
    route: TRoute[];
}

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    route: [
        {
            name: {
                type: String,
                required: true,
            },
            fair: {
                type: Number,
                required: true,
            }
        }
    ]
})

export default mongoose.model<IRoute>('Route', routeSchema)