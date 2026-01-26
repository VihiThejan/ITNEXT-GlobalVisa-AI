import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
    user: mongoose.Types.ObjectId;
    type: 'ASSESSMENT_GENERATED' | 'COUNTRY_VIEWED' | 'COMPARISON_MADE' | 'CONTACT_REQUEST';
    details: any; // Flexible to store country name, visa type, or full assessment result
    timestamp: Date;
}

const ActivitySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['ASSESSMENT_GENERATED', 'COUNTRY_VIEWED', 'COMPARISON_MADE', 'CONTACT_REQUEST'],
        required: true
    },
    details: { type: Schema.Types.Mixed }, // JSON data
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
