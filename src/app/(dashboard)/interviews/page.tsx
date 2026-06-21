"use client";

import React, { useState, useEffect } from "react";
import AddCandidateModal from "@/components/AddCandidateModal";
import { Search, Plus, MoreHorizontal, UserPlus, ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InterviewsDashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
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

    fetchInterviews();
  }, []);


  return (
    <div className="w-full p-8 space-y-6">
      {/* Header */}


      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total interviews", value: "1,284", sub: "+12% this month" },
          { label: "Active Interviews", value: "42", sub: "8 scheduled today" },
          { label: "Time to Hire", value: "18d", sub: "-2d from avg." }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
            <p className="text-[11px] font-semibold text-gray-500 uppercase">{stat.label}</p>
            <p className="text-3xl font-bold text-[#0b1c30] mt-1">{stat.value}</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">{stat.sub}</p>
          </div>
        ))}
        <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#ad2c00]/30 transition-colors">
          <Plus className="w-6 h-6 text-[#ad2c00]" />
          <span className="text-xs font-bold text-[#ad2c00] mt-2">New Job Posting</span>
        </div>
      </div> */}

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
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center">Loading...</td></tr>
            ) : (
              interviews.map((i: any) => (
                <tr key={i._id} className="hover:bg-[#F8FAFC] cursor-pointer">
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
                      year: "numeric"
                    })}
                    <span className="block text-xs font-bold text-[#ad2c00]">
                      {new Date(i.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </span>
                  </td>

                  {/* Interviewer Name */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {i.interviewerName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Dynamic Pagination UI */}

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h3 className="font-bold mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gray-200" />
              <div>
                <p className="font-bold text-sm">David Chen <span className="text-gray-400 font-normal text-xs">• 2 hours ago</span></p>
                <p className="text-sm italic my-1">"Alex Mercer's technical assessment was outstanding. Let's move them to the final executive round immediately."</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[#ad2c00] text-xs font-semibold flex items-center gap-1"><ThumbsUp size={12} /> Approved</span>
                  <span className="text-gray-500 text-xs">Candidate: Alex Mercer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold">Upcoming</h3>
            <span className="text-xs text-[#ad2c00] cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg hover:border-[#ad2c00] transition-colors">
              <p className="font-bold text-sm">Final Review</p>
              <p className="text-xs text-gray-500">Maya Nguyen • 10:00 AM</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-[10px] rounded uppercase font-semibold text-gray-600">Zoom</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
}