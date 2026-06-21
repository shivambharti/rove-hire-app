"use client";

import React, { useState } from "react";

interface ModalProps {
    candidateId: string;
    jobId: string;
    onClose: () => void;
    onRefresh: () => void;
}

export default function ScheduleInterviewModal({ candidateId, jobId, onClose, onRefresh }: ModalProps) {
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        type: "Screening",
        interviewerName: "",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create a proper ISO string that includes the 'Z' to represent UTC
        // We combine the date and time strings and force UTC by appending 'Z'
        const isoDateTime = `${formData.date}T${formData.time}:00Z`;
        const combinedDateTime = new Date(isoDateTime);

        const res = await fetch("/api/interviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                candidateId,
                jobId,
                date: combinedDateTime.toISOString(), // Send as explicit ISO string
                type: formData.type,
                interviewerName: formData.interviewerName,
                notes: formData.notes
            })
        });

        if (res.ok) {
            onRefresh();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="relative w-full max-w-[560px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-[#0b1c30]">Schedule Interview</h3>
                        <p className="text-sm text-gray-500 mt-1">Select a date and time to meet with the candidate.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                            <input
                                required type="date"
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Time</label>
                            <input
                                required type="time"
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                            <select
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Screening">Screening</option>
                                <option value="Technical">Technical</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Interviewer</label>
                            <input
                                required type="text" placeholder="e.g. Sarah Jenkins"
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Notes</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-lg border border-slate-200"
                            rows={4}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-[#ad2c00] text-white rounded-lg font-bold hover:opacity-90">Schedule Interview</button>
                    </div>
                </form>
            </div>
        </div>
    );
}