import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Candidate } from "@/models/Candidate";

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
            .lean(); // Returns plain JS object for easy manipulation

        if (!candidate) {
            return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
        }

        // Sort and limit in memory - simple and fast for small arrays
        if (candidate.timeline) {
            candidate.timeline = [...candidate.timeline] // Copy to avoid mutation
                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        }

        return NextResponse.json(candidate, { status: 200 });
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