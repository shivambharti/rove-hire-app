import connectToDatabase from "@/lib/mongodb";
import { Interview } from "@/models/Interview";
import { Candidate } from "@/models/Candidate"; // Assuming this exists
import { NextResponse } from "next/server";

// POST: Schedule a new interview
export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        console.log("body",body)
        const { candidateId, jobId, date, type, interviewerName, notes } = body;

        // 1. Create the interview record
        const newInterview = await Interview.create({
            candidateId,
            jobId,
            date,
            type,
            interviewerName,
            notes,
        });

        // 2. Update the candidate's status to "Interview Scheduled"
        await Candidate.findByIdAndUpdate(candidateId, {
            status: "Interview Scheduled",
            $push: { timeline: { status: "Interview Scheduled", note: `Scheduled ${type} with ${interviewerName}` } }
        });

        return NextResponse.json(newInterview, { status: 201 });
    } catch (error) {
        console.log("error",error);
        return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
    }
}

// GET: Fetch all interviews sorted by date
export async function GET() {
    try {
        await connectToDatabase();
        // Fetch only scheduled interviews, sorted by date (ascending)
        const interviews = await Interview.find({ status: "Scheduled" })
            .sort({ date: -1 })
            .populate("candidateId", "name") // Join candidate name
            .populate("jobId", "title");     // Join job title

        return NextResponse.json(interviews, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
    }
}