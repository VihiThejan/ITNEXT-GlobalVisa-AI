import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    password: string;
    name: string;
    role: 'super-admin' | 'admin';
    createdAt: Date;
    lastLogin?: Date;
}

const AdminSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['super-admin', 'admin'], default: 'admin' },
    lastLogin: { type: Date }
}, { timestamps: true });

// Transform to match frontend expectations
AdminSchema.set('toJSON', {
    transform: function (doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Never send password to frontend
        return ret;
    }
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);
