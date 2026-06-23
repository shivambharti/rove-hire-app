"use client";

import React, { useState, useEffect } from "react";
import AddCandidateModal from "@/components/AddCandidateModal";
import { Search, Plus, MoreHorizontal, UserPlus, ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CandidatePipelineDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // Dynamic count
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Candidates");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const fetchCandidates = async () => {
    setLoading(true);

    try {
      const url = `/api/candidates?search=${encodeURIComponent(
        searchQuery
      )}&status=${encodeURIComponent(activeTab)}&page=${currentPage}`;

      const res = await fetch(url);
      const data = await res.json();

      setCandidates(data.candidates);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, currentPage]);

  const totalPages = Math.ceil(totalCount / 10);

  // 2. Add this handler
  const handleRowClick = (candidate: any) => {
    router.push(`/candidates/${candidate._id}`);
  };

  const handleCandidateAdded = async () => {
    await fetchCandidates();
  };
  return (
    <div className="w-full p-8 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>

          <h2 className="text-2xl font-bold text-[#ad2c00]">Candidate Pipeline</h2>
          <p className="text-sm text-zinc-500">Manage candidate's listings.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or role..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#ad2c00]/20 outline-none"
            />
          </div>
          {/* ADD CANDIDATE BUTTON */}
          <button
            onClick={() => { setShowModal(true) }}
            className="flex items-center gap-2 bg-[#ad2c00] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#ad2c00]/90 transition-colors"
          >
            <UserPlus size={16} />
            Add Candidate
          </button>
        </div>
      </header>


      {/* Pipeline Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-2">
          {['All Candidates', 'Applied', 'Form Submitted', 'Interview Scheduled', 'Offer Sent', 'Hired', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }} // Reset to page 1 on tab change
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold ${tab === activeTab ? "bg-[#ad2c00] text-white" : "border border-[#E2E8F0] text-gray-600 hover:bg-gray-50"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Candidate Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role Applied</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Current Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Last Activity</th>
              {/* <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center">Loading...</td></tr>
            ) : (
              candidates.map((c: any) => (
                <tr key={c._id} onClick={() => handleRowClick(c)}
                  className="hover:bg-[#F8FAFC] cursor-pointer">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {/* Generate initials dynamically if needed */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{c.jobOpening?.title || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-blue-100 text-blue-800">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(c.updatedAt).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  {/* <td className="px-6 py-4 text-right">
                    <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-400" />
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Dynamic Pagination UI */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Showing {candidates.length} of {totalCount} candidates
          </p>

          <div className="flex gap-1 items-center">
            {/* Previous Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dynamic Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-xs border ${currentPage === page
                  ? "bg-[#ad2c00] text-white border-[#ad2c00]"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showModal && <AddCandidateModal onClose={() => setShowModal(false)} onCandidateAdded={handleCandidateAdded}
      />}

    </div>

  );
}