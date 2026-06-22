import connectToDatabase from "@/lib/mongodb";
import { Interview } from "@/models/Interview";
import { Candidate } from "@/models/Candidate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { candidateId, jobId, date, type, interviewerName, notes } = body;

        // 1. Create the interview record
        const newInterview = await Interview.create({
            candidateId,
            jobId,
            date, // Ensure this is a valid Date object or ISO string
            type,
            interviewerName,
            notes,
        });

        // 2. Format the date for the timeline note
        const interviewDate = new Date(date);
        const formattedDate = interviewDate.toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
        const formattedTime = interviewDate.toLocaleTimeString("en-US", {
            hour: "2-digit", minute: "2-digit", hour12: true
        });

        const timelineNote = `Scheduled ${type} with ${interviewerName} on ${formattedDate} at ${formattedTime}`;

        // 3. Update the candidate's status
        await Candidate.findByIdAndUpdate(candidateId, {
            status: "Interview Scheduled",
            $push: {
                timeline: {
                    status: "Interview Scheduled",
                    note: timelineNote,
                    timestamp: new Date() // Records when the action happened
                }
            }
        });

        return NextResponse.json(newInterview, { status: 201 });
    } catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
    }
}

// GET: Fetch all interviews sorted by date
export async function GET() {
    try {
        await connectToDatabase();
        const interviews = await Interview.find()
            .sort({ date: -1 })
            .populate("candidateId", "name") // Join candidate name
            .populate("jobId", "title");     // Join job title

        return NextResponse.json(interviews, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
    }
}