import mongoose, { Schema, Document } from 'mongoose';

export interface VisaCategory {
  id: string;
  name: string;
  purpose: string;
  eligibility: string[];
  qualifications: string;
  experience: string;
  language: string;
  finance: string;
  processingTime: string;
  settlementPotential: boolean;
}

export interface ICountry extends Document {
  id: string;
  name: string;
  flag: string;
  description: string;
  economy: string;
  jobMarket: string;
  education: string;
  prBenefits: string;
  history?: string;
  geography?: string;
  politics?: string;
  studentInfo?: string;
  jobInfo?: string;
  visas: VisaCategory[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VisaCategorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  eligibility: [{ type: String }],
  qualifications: { type: String, required: true },
  experience: { type: String, required: true },
  language: { type: String, required: true },
  finance: { type: String, required: true },
  processingTime: { type: String, required: true },
  settlementPotential: { type: Boolean, required: true }
});

const CountrySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  flag: { type: String, required: true },
  description: { type: String, required: true },
  economy: { type: String, required: true },
  jobMarket: { type: String, required: true },
  education: { type: String, required: true },
  prBenefits: { type: String, required: true },
  history: { type: String },
  geography: { type: String },
  politics: { type: String },
  studentInfo: { type: String },
  jobInfo: { type: String },
  visas: [VisaCategorySchema],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<ICountry>('Country', CountrySchema);
