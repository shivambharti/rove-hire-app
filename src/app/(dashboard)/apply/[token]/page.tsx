import ApplyPortal from "@/components/ApplyPortal";
import connectToDatabase from "@/lib/mongodb";
import { Candidate } from "@/models/Candidate";

// Define the shape of your params
type PageProps = {
    params: Promise<{ token: string }>;
};

export default async function ApplyPage({ params }: PageProps) {
    // Await the params to get the token (Required in Next.js 15+)
    const { token } = await params;

    // Optional: Add a simple server-side check to see if the token exists
    await connectToDatabase();
    const candidate = await Candidate.findOne({ magicLinkToken: token, isTokenUsed: { $ne: true } });

    if (!candidate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
                <p>Invalid or expired application link.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
            <ApplyPortal candidateId={token} name={candidate.name} email={candidate.email} />
        </main>
    );
}