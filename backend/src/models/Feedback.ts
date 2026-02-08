import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
    user: mongoose.Types.ObjectId;
    message: string;
    category?: string;
    status: 'pending' | 'replied' | 'closed';
    replies: {
        admin: mongoose.Types.ObjectId;
        message: string;
        timestamp: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['bug', 'feature', 'general', 'other'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['pending', 'replied', 'closed'],
        default: 'pending'
    },
    replies: [{
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
