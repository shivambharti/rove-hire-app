import { NextRequest, NextResponse } from "next/server";
import { Interview } from "@/models/Interview";
import { Candidate } from "@/models/Candidate"; // 1. Import Candidate model
import connectToDatabase from "@/lib/mongodb";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        const { id } = await params;
        const body = await req.json();
        const { recommendation, notes } = body;

        // 2. Update the Interview
        const updatedInterview = await Interview.findByIdAndUpdate(
            id,
            {
                status: "Completed",
                feedback: {
                    recommendation: recommendation,
                    note: notes
                }
            },
            { returnDocument: 'after' }
        );

        if (!updatedInterview) {
            return NextResponse.json({ error: "Interview not found" }, { status: 404 });
        }

        // 3. Push "Feedback Recorded" to the Candidate's timeline
        await Candidate.findByIdAndUpdate(updatedInterview.candidateId, {
            $push: {
                timeline: {
                    status: "Feedback Recorded",
                    note: `Feedback for ${updatedInterview.type || 'interview'} completed: ${recommendation}`
                }
            }
        });

        return NextResponse.json(updatedInterview);
    } catch (error) {
        console.error("Error updating interview:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}