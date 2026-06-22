import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Candidate } from "@/models/Candidate";
import { Interview } from "@/models/Interview";

// GET: Fetch a single candidate by ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Fetch candidate and populate the job reference
        const candidate = await Candidate.findById(id)
            .populate("jobOpening")
            .lean(); 

        if (!candidate) {
            return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
        }

        // Sort timeline
        if (candidate.timeline) {
            candidate.timeline = [...candidate.timeline]
                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        // Fetch interviews for this candidate
        const interviews = await Interview.find({ candidateId: id }).lean();
        
        // Combine candidate data with the fetched interviews
        const responseData = {
            ...candidate,
            interviews // Now the interviews are included in the JSON response
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error fetching candidate:", error);
        return NextResponse.json({ error: "Failed to fetch candidate" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status, note } = await req.json();

        await connectToDatabase();

        // 1. Perform the update
        await Candidate.findByIdAndUpdate(
            id,
            {
                $set: { status: status },
                $push: { timeline: { status, note, timestamp: new Date() } }
            },
            { runValidators: true }
        );

        // 2. Fetch the updated document
        const updatedCandidate = await Candidate.findById(id).populate("jobOpening").lean();

        // 3. Apply the same Sort and Limit logic as the GET route
        if (updatedCandidate?.timeline && Array.isArray(updatedCandidate.timeline)) {
            updatedCandidate.timeline = [...updatedCandidate.timeline]
                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        }

        return NextResponse.json(updatedCandidate, { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}