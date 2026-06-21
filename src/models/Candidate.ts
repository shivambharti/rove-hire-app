import mongoose, { Schema, Document } from 'mongoose';

const TimelineEventSchema = new Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
});

const CandidateSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
        type: String,
        enum: ['Applied', 'Form Submitted', 'Interview Scheduled', 'Offer Sent', 'Hired', 'Rejected'],
        default: 'Applied'
    },
    jobOpening: { type: Schema.Types.ObjectId, ref: 'JobOpening', required: true },
    resumeUrl: { type: String },

    // New Optional Fields
    phoneNumber: { type: String },
    currentLocation: { type: String },
    currentRole: { type: String },
    noticePeriod: { type: String },
    salaryExpectation: { type: String },
    linkedinUrl: { type: String },
    // Timeline array: newest events first
    timeline: [TimelineEventSchema]
}, { timestamps: true });

export const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);