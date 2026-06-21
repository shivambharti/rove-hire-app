import connectToDatabase from "@/lib/mongodb";
import { JobOpening } from "@/models/JobOpening";
import { NextResponse,NextRequest } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const jobs = await JobOpening.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "candidates", // Ensure this matches your actual collection name in MongoDB
          localField: "_id",
          foreignField: "jobOpening", // The field in your Candidate model that links to the job
          as: "candidates"
        }
      },
      {
        $project: {
          title: 1,
          status: 1,
          createdAt: 1,
          skills: 1,
          candidateCount: { $size: "$candidates" } // Dynamically counts the linked candidates
        }
      }
    ]);

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST: Create a new job opening
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const newJob = await JobOpening.create(body);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}