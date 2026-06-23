"use client";

import React, { useState, useEffect } from "react";
import { Plus, MoreVertical, ArrowRight, TrendingUp } from "lucide-react";
import AddJobOpeningModal from "@/components/AddJobOpeningModal";

export default function JobOpeningsPage() {
    const [showModal, setShowModal] = useState(false);
    const [jobs, setJobs] = useState([]); // Initialize as empty array
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    // Fetch dynamic data from the API
    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/jobOpenings");
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);
    const handleJobCreated = async () => {
        await fetchJobs();

        setSuccessMessage("Job opening created successfully.");

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
            <main className="p-8 max-w-[1400px] mx-auto space-y-8">
                {successMessage && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top duration-300">
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="font-medium">{successMessage}</span>
                        </div>
                    </div>
                )}
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                                <h2 className="text-2xl font-bold text-[#ad2c00]">Job Pipeline</h2>

                        <p className="text-sm text-zinc-500">Manage your current job listings.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-[#ad2c00] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90"
                    >
                        <Plus className="w-4 h-4" /> Create Job Opening
                    </button>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-12 gap-6">
                    {isLoading ? (
                        <div className="col-span-12 text-center py-20 text-zinc-500">Loading jobs...</div>
                    ) : (
                        jobs.map((job: any) => (
                            <div key={job._id} className="col-span-12 lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${job.status === "Open" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"}`}>
                                        {job.status}
                                    </span>
                                    {/* <MoreVertical className="w-4 h-4 text-zinc-400" /> */}
                                </div>
                                <h4 className="text-lg font-bold text-zinc-900">{job.title}</h4>

                                {/* Dynamic Candidate Count */}
                                <div className="flex items-center gap-2 my-6">
                                    <p className="text-sm font-bold text-[#ad2c00]">{job.candidateCount}</p>
                                    <p className="text-sm text-zinc-600">Candidates</p>
                                </div>

                                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                                    <div className="flex gap-1.5">
                                        {job.skills?.map((skill: string) => (
                                            <span key={skill} className="text-xs text-zinc-500 bg-zinc-50 px-2 py-1 rounded">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {showModal && (
                <AddJobOpeningModal
                    onClose={() => setShowModal(false)}
                    onJobCreated={handleJobCreated}
                />
            )}
        </div>
    );
}