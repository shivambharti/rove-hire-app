import mongoose, { Schema, model, models } from "mongoose";

const InterviewSchema = new Schema({
  candidateId: { 
    type: Schema.Types.ObjectId, 
    ref: "Candidate", 
    required: true 
  },
  jobId: { 
    type: Schema.Types.ObjectId, 
    ref: "JobOpening", 
    required: true 
  },
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ["Screening", "Technical"], 
    required: true 
  },
  interviewerName: { type: String, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ["Scheduled", "Completed"], 
    default: "Scheduled" 
  },
  feedback: {
    recommendation: { type: String, enum: ["Hire", "No-Hire", "Maybe"] },
    note: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export const Interview = models.Interview || model("Interview", InterviewSchema);