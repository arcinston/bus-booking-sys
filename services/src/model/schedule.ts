import mongoose from 'mongoose'

export interface ISchedule extends mongoose.Document {
    time: string;
}

const scheduleSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
    }
})

export default mongoose.model<ISchedule>('Schedule', scheduleSchema)