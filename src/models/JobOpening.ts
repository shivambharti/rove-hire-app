import mongoose, { Schema } from 'mongoose';

const JobOpeningSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
}, { timestamps: true });

export const JobOpening = mongoose.models.JobOpening || mongoose.model('JobOpening', JobOpeningSchema);