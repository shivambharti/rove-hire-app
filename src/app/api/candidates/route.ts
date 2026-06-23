import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Candidate } from "@/models/Candidate";
import "@/models/JobOpening";
import { put } from "@vercel/blob";
import crypto from 'crypto';
export async function GET(req: NextRequest) {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "All Candidates";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    // 1. Base Pipeline (Shared by data fetch and count)
    const pipeline: any[] = [
        {
            $lookup: {
                from: "jobopenings",
                localField: "jobOpening",
                foreignField: "_id",
                as: "jobOpening"
            }
        },
        { $unwind: { path: "$jobOpening", preserveNullAndEmptyArrays: true } },
        { $match: statusFilter !== "All Candidates" ? { status: statusFilter } : {} }
    ];

    // 2. Add search logic to pipeline
    if (searchQuery) {
        pipeline.push({
            $match: {
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { "jobOpening.title": { $regex: searchQuery, $options: "i" } }
                ]
            }
        });
    }

    // 3. Get Total Count (execute count pipeline)
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Candidate.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    // 4. Get Paginated Data (add pagination and project to main pipeline)
    pipeline.push(
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                name: 1,
                email: 1,
                status: 1,
                resumeUrl: 1,
                updatedAt: 1,
                "jobOpening.title": 1
            }
        }
    );

    const candidates = await Candidate.aggregate(pipeline);

    return NextResponse.json({
        candidates,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
    });
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        // 1. Parse the FormData
        const formData = await req.formData();
        const file = formData.get("resume") as File | null;
        
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const jobOpening = formData.get("jobOpening") as string;

        let resumeUrl = "";

        // 2. Upload File to Vercel Blob
        if (file) {
            const blob = await put(file.name, file, {
                access: 'public',
                addRandomSuffix:true
            });
            resumeUrl = blob.url;
        }

        // 3. Generate secure magic link token and expiration (14 days)
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14);

        // 4. Create Candidate in MongoDB
        const newCandidate = await Candidate.create({
            name,
            email,
            jobOpening,
            resumeUrl,
            status: "Applied",
            timeline: [{ status: "Applied", timestamp: new Date(), note: "Initial application" }],
            magicLinkToken: token,       // Added
            magicLinkExpiresAt: expiresAt // Added
        });

        // Return candidate along with the generated magic link for the UI
        const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL}/apply/${token}`;
        
        return NextResponse.json({ 
            candidate: newCandidate, 
            magicLink 
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating candidate:", error);
        return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
    }
}