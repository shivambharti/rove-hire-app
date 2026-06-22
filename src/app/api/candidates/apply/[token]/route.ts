import { NextResponse } from 'next/server';
import { Candidate } from '@/models/Candidate';
import connectToDatabase from "@/lib/mongodb";

// Updated the params type to reflect that it is a Promise
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
    await connectToDatabase();
    
    // 1. Unwrap params by awaiting it
    const { token } = await params;
    const body = await req.json();

    const updatedCandidate = await Candidate.findOneAndUpdate(
        { 
            magicLinkToken: token, // Use the unwrapped token
            isTokenUsed: { $ne: true },
            magicLinkExpiresAt: { $gt: new Date() } 
        },
        {
            $set: {
                ...body,
                status: 'Form Submitted',
                isTokenUsed: true 
            },
            $push: {
                timeline: { status: 'Form Submitted', note: 'Candidate completed details' }
            }
        },
        // 2. Use returnDocument: 'after' instead of { new: true }
        { returnDocument: 'after' }
    );

    if (!updatedCandidate) {
        return NextResponse.json(
            { error: "Invalid link, link expired, or application already submitted." }, 
            { status: 400 }
        );
    }

    return NextResponse.json(updatedCandidate);
}