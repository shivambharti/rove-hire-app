"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import { Mail, Phone, MapPin, Download, Calendar, UserMinus, CheckCircle } from "lucide-react";
import ScheduleInterviewModal from "@/components/ScheduleInterviewModal";
import GenerateOfferModal from "@/components/GenerateOfferModal";
export default function CandidateProfile() {
    const params = useParams();
    const candidateId = params.id as string;
    const [hireError, setHireError] = useState("");
    const [rejectReasonError, setRejectReasonError] = useState("");
    const [candidate, setCandidate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    useEffect(() => {
        if (!candidateId) return;

        fetchCandidate();
    }, [candidateId]);
    const fetchCandidate = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/candidates/${candidateId}`);
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setCandidate(data);
        } catch (error) {
            console.error("Error fetching candidate:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string, note: string) => {
        try {
            const response = await fetch(`/api/candidates/${candidateId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus, note }),
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {

                await fetchCandidate()
                setShowRejectInput(false);

                setRejectReason("");
                setRejectReasonError("");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: { [key: string]: string } = {
            'Applied': 'bg-slate-100 text-slate-700',
            'Form Submitted': 'bg-blue-100 text-blue-700',
            'Interview Scheduled': 'bg-purple-100 text-purple-700',
            'Offer Sent': 'bg-amber-100 text-amber-800',
            'Hired': 'bg-emerald-100 text-emerald-800',
            'Rejected': 'bg-red-100 text-red-800',
        };

        // Default to gray if status doesn't match
        const badgeClass = styles[status] || 'bg-gray-100 text-gray-600';

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (!candidate) return <div className="p-8">Candidate not found.</div>;

    return (
        <main className="p-8 max-w-[1440px] mx-auto min-h-screen">
            <section className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-12 bg-white border border-[#E2E8F0] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start gap-6 shadow-sm">
                    <div className="flex items-center gap-8">
                        <div>
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-bold">{candidate.name}</h3>
                                {getStatusBadge(candidate.status)}
                            </div>
                            <p className="text-gray-500 flex items-center gap-2 mb-4">
                                <MapPin size={16} /> {candidate.currentLocation || "Location N/A"} • {candidate.currentRole || "N/A"}
                            </p>
                            <div className="flex gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-2"><Mail size={16} /> {candidate.email}</span>
                                <span className="flex items-center gap-2"><Phone size={16} /> {candidate.phoneNumber || "No phone"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Only show if status is Interview Scheduled or Offer Sent (Exclude Hired/Rejected) */}
                        {['Interview Scheduled', 'Offer Sent'].includes(candidate.status) && (
                            <button
                                className="bg-[#ad2c00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#8e2400] transition-colors"
                                onClick={() => {
                                    setHireError("");
                                    setShowOfferModal(true);
                                }}                            >
                                {candidate.offerLetterUrl ? "Regenerate Offer Documents" : "Generate Offer Documents"}
                            </button>
                        )}
                        <a
                            href={candidate.resumeUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`border border-[#E2E8F0] px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${!candidate.resumeUrl ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                                }`}
                        >
                            <Download size={16} />
                            {candidate.resumeUrl ? "Download Resume" : "No Resume Uploaded"}
                        </a>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white border border-[#E2E8F0] rounded-xl p-8">
                        <h4 className="font-bold text-lg mb-6">Application Timeline</h4>
                        <div className="relative flex flex-col gap-8 ml-4 border-l-2 border-[#E2E8F0] pl-6">
                            {candidate.timeline?.map((step: any, index: number) => (
                                <div key={index} className="relative">
                                    <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-[#ad2c00]"></div>
                                    <h5 className="font-bold">{step.status}</h5>
                                    <p className="text-sm text-gray-500">
                                        {new Date(step.timestamp).toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric"
                                        })}
                                    </p>
                                    <p className="text-sm mt-1">{step.note || "No details provided."}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                        <h4 className="font-bold mb-4">Candidate Snapshot</h4>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-400 uppercase text-[10px] font-bold">Expected Salary</p>
                                <p className="font-bold">
                                    {candidate.salaryExpectation != null &&
                                        candidate.salaryExpectation !== ""
                                        ? `$${candidate.salaryExpectation}`
                                        : "Not specified"}
                                </p>                            </div>
                            <div>
                                <p className="text-gray-400 uppercase text-[10px] font-bold">Notice Period</p>
                                <p className="font-bold">{candidate.noticePeriod || "Not specified"}</p>
                            </div>

                            <div>
                                <p className="text-gray-400 uppercase text-[10px] font-bold">
                                    LinkedIn Profile
                                </p>

                                {candidate.linkedinUrl ? (
                                    <a
                                        href={candidate.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {candidate.linkedinUrl}
                                    </a>
                                ) : (
                                    <p className="font-bold">Not specified</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Documents Section */}
                        {candidate.offerLetterUrl && (
                            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mt-6">
                                <h4 className="font-bold mb-4">Documents</h4>
                                <div className="space-y-2">
                                    <a
                                        href={candidate.offerLetterUrl}
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                    >
                                        <Download size={16} /> Offer Letter (PDF)
                                    </a>
                                    {candidate.ndaUrl && (
                                        <a
                                            href={candidate.ndaUrl}
                                            target="_blank"
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                        >
                                            <Download size={16} /> NDA (PDF)
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {candidate.status === 'Hired' && (
                            <div className="w-full p-4 border border-emerald-200 text-emerald-700 bg-emerald-50 rounded-xl font-bold flex justify-center items-center gap-2">
                                <CheckCircle size={18} /> Candidate Successfully Hired
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">

                        {/* NEW: Interview Feedback Section */}
                        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8">
                            <h4 className="font-bold text-lg mb-6">Interview Feedback</h4>
                            {candidate.interviews?.length > 0 ? (
                                <div className="space-y-4">
                                    {candidate.interviews.map((i: any) => (
                                        <div key={i._id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                                            <p className="text-sm font-bold capitalize">{i.type || "Interview"} Feedback</p>
                                            {i.feedback ? (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <p><span className="font-bold">Recommendation:</span> {i.feedback.recommendation}</p>
                                                    <p><span className="font-bold">Notes:</span> {i.feedback.note}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic mt-1">No feedback provided yet.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No interviews recorded.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">

                        {/* 2. Add the Schedule Interview Button */}
                        {/* 2. Schedule Interview Button - Only show if not Hired/Rejected */}
                        {candidate.status !== 'Hired' && candidate.status !== 'Rejected' && (
                            <button
                                onClick={() => setShowScheduleModal(true)}
                                className="w-full p-4 border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 font-bold flex justify-between items-center"
                            >
                                Schedule Interview <Calendar size={18} />
                            </button>
                        )}
                        {/* Hired Action */}
                        {/* Updated Hired Action */}
                        {candidate.status !== "Hired" &&
                            candidate.status !== "Rejected" && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (candidate.status !== "Offer Sent") {
                                                setHireError(
                                                    "Please generate and send an offer letter before marking this candidate as hired."
                                                );

                                                setTimeout(() => {
                                                    setHireError("");
                                                }, 4000);

                                                return;
                                            }

                                            updateStatus(
                                                "Hired",
                                                "Candidate accepted the offer."
                                            );
                                        }}
                                        className="w-full p-4 border border-green-200 text-green-600 rounded-xl hover:bg-green-50 font-bold flex justify-between items-center"
                                    >
                                        Mark as Hired
                                        <CheckCircle size={18} />
                                    </button>

                                    {hireError && (
                                        <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl flex items-start gap-3">
                                            <AlertTriangle
                                                size={18}
                                                className="text-amber-600 mt-0.5 flex-shrink-0"
                                            />

                                            <p className="text-sm font-medium text-amber-700">
                                                {hireError}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        {/* Only show the Rejection area if the candidate is NOT already Hired or Rejected */}
                        {candidate.status !== 'Hired' && candidate.status !== 'Rejected' && (
                            <>
                                {!showRejectInput ? (
                                    <button
                                        onClick={() => setShowRejectInput(true)}
                                        className="w-full p-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-bold flex justify-between items-center"
                                    >
                                        Reject Candidate <UserMinus size={18} />
                                    </button>
                                ) : (
                                    <div className="space-y-2 p-4 border border-red-200 rounded-xl bg-red-50">
                                        <textarea
                                            className="w-full p-2 border rounded text-sm"
                                            placeholder="Reason for rejection..."
                                            rows={3}
                                            value={rejectReason}
                                            onChange={(e) => {
                                                setRejectReason(e.target.value);

                                                if (rejectReasonError) {
                                                    setRejectReasonError("");
                                                }
                                            }}
                                        />

                                        {rejectReasonError && (
                                            <p className="text-sm text-red-500">
                                                {rejectReasonError}
                                            </p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    if (!rejectReason.trim()) {
                                                        setRejectReasonError(
                                                            "Rejection reason is required"
                                                        );
                                                        return;
                                                    }

                                                    updateStatus("Rejected", rejectReason);
                                                }} className="flex-1 bg-red-600 text-white py-2 rounded text-sm font-bold"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowRejectInput(false);
                                                    setRejectReason("");
                                                    setRejectReasonError("");
                                                }} className="flex-1 border py-2 rounded text-sm bg-white"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. Render the Modal */}
            {showScheduleModal && (
                <ScheduleInterviewModal
                    candidateId={candidateId}
                    jobId={candidate.jobOpening}
                    onClose={() => setShowScheduleModal(false)}
                    onRefresh={() => window.location.reload()}
                />
            )}

            {showOfferModal && (
                <GenerateOfferModal
                    candidate={candidate}
                    onClose={() => setShowOfferModal(false)}
                    onRefresh={() => window.location.reload()}
                />
            )}
        </main>
    );
}