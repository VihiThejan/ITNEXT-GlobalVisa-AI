import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    fullName: string;
    provider: 'email' | 'google';
    role: 'user' | 'admin';
    isVerified: boolean;
    avatar?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth
    fullName: { type: String, required: true },
    provider: { type: String, enum: ['email', 'google'], default: 'email' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
    assessmentHistory: { type: Array, default: [] },
    profile: { type: Object, default: {} }
}, { timestamps: true });

// Transform to match frontend expectations
UserSchema.set('toJSON', {
    transform: function (doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        if (!ret.assessmentHistory) {
            ret.assessmentHistory = [];
        }
        return ret;
    }
});

export default mongoose.model<IUser>('User', UserSchema);
