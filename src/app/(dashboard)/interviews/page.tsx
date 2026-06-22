"use client";

import React, { useState, useEffect } from "react";
import AddCandidateModal from "@/components/AddCandidateModal";
import { Search, Plus, MoreHorizontal, UserPlus, ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";
import FeedbackModal from "@/components/FeedbackModal";
import { useRouter } from "next/navigation";

export default function InterviewsDashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, interviewId: null, candidateName: "", initialData: null });
  const router = useRouter();

  const submitFeedback = async (data: any) => {
    await fetch(`/api/interviews/${feedbackModal.interviewId}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    setFeedbackModal({ isOpen: false, interviewId: null, candidateName: "", initialData: null });
    // Refresh your interview list here
  };
  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/interviews");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInterviews(data);
    } catch (err) {
      console.error("Error loading interviews:", err);
    } finally {
      setLoading(false);
    }
  };
  // Fetch data from the API
  useEffect(() => {


    fetchInterviews();
  }, []);

  const handleRowClick = (interview: any) => {
    // Ensure you are accessing the nested _id of the candidateId object
    if (interview.candidateId && interview.candidateId._id) {
      router.push(`/candidates/${interview.candidateId._id}`);
    }
  };
  return (
    <div className="w-full p-8 space-y-6">

      {/* Pipeline Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Candidate Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Job Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Interviewer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center">Loading...</td></tr>
            ) : (
              interviews.map((i: any) => (
                <tr key={i._id} className="hover:bg-[#F8FAFC] cursor-pointer" onClick={() => handleRowClick(i)}>
                  {/* Candidate Name */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200">
                      {i.candidateId?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{i.candidateId?.name || "Unknown Candidate"}</p>
                    </div>
                  </td>

                  {/* Job Role */}
                  <td className="px-6 py-4 text-sm">{i.jobId?.title || "N/A"}</td>

                  {/* Interview Type */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-blue-100 text-blue-800 uppercase">
                      {i.type}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(i.date).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                      timeZone: "UTC" // Force UTC
                    })}
                    <span className="block text-xs font-bold text-[#ad2c00]">
                      {new Date(i.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "UTC" // Force UTC
                      })}
                    </span>
                  </td>

                  {/* Interviewer Name */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {i.interviewerName}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {i.status}
                  </td>

                  <td className="px-6 py-4">
                    {i.status === "Completed" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents row click from firing
                          setFeedbackModal({
                            isOpen: true,
                            interviewId: i._id,
                            candidateName: i.candidateId.name,
                            initialData: i.feedback
                          });
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline uppercase"
                      >
                        View Feedback
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents row click from firing
                          setFeedbackModal({
                            isOpen: true,
                            interviewId: i._id,
                            candidateName: i.candidateId.name,
                            initialData: null
                          });
                        }}
                        className="text-[10px] font-bold text-[#ad2c00] hover:underline uppercase"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Dynamic Pagination UI */}

      </div>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, interviewId: null, candidateName: "", initialData: null })}
        candidateName={feedbackModal.candidateName}
        initialData={feedbackModal.initialData}
        onSubmit={async (data: any) => {
          try {
            // Replace the fetch(...) placeholder with the actual call
            const res = await fetch(`/api/interviews/complete/${feedbackModal.interviewId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Submission failed");

            // Reset modal and refresh list
            setFeedbackModal({ isOpen: false, interviewId: null, candidateName: "", initialData: null });
            fetchInterviews();

            console.log("Feedback submitted successfully");
          } catch (error) {
            console.error("Error submitting feedback:", error);
          }
        }}
      />
    </div>

  );
}