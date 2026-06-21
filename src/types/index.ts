export type CandidateStatus = 
  | "APPLIED" 
  | "SCREENING" 
  | "INTERVIEW_SCHEDULED" 
  | "OFFER_SENT" 
  | "REJECTED";

export interface ICandidate {
  _id?: string;
  name: string;
  email: string;
  role: string;
  status: CandidateStatus;
  lastActivityDate: string;
  skills: string[];
}