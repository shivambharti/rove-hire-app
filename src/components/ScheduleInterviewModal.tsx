"use client";

import { X } from "lucide-react";
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

    const [errors, setErrors] = useState({
        date: "",
        time: "",
        type: "",
        interviewerName: "",
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = {
            date: "",
            time: "",
            type: "",
            interviewerName: "",
        };

        if (!formData.date) {
            validationErrors.date = "Interview date is required";
        }

        if (!formData.time) {
            validationErrors.time = "Interview time is required";
        }

        if (!formData.type) {
            validationErrors.type = "Interview type is required";
        }

        if (!formData.interviewerName.trim()) {
            validationErrors.interviewerName =
                "Interviewer name is required";
        }

        setErrors(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) {
            return;
        }

        const isoDateTime = `${formData.date}T${formData.time}:00Z`;
        const combinedDateTime = new Date(isoDateTime);

        const res = await fetch("/api/interviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                candidateId,
                jobId,
                date: combinedDateTime.toISOString(),
                type: formData.type,
                interviewerName: formData.interviewerName,
                notes: formData.notes,
            }),
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
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>

                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Date<span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                value={formData.date}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        date: e.target.value,
                                    });

                                    if (errors.date) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            date: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.date && (
                                <p className="text-sm text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Time<span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                value={formData.time}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        time: e.target.value,
                                    });

                                    if (errors.time) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            time: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.time && (
                                <p className="text-sm text-red-500">
                                    {errors.time}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Type<span className="text-red-500">*</span></label>
                            <select
                                value={formData.type}
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        type: e.target.value,
                                    });

                                    if (errors.type) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            type: "",
                                        }));
                                    }
                                }}
                            >
                                <option value="Screening">Screening</option>
                                <option value="Technical">Technical</option>
                            </select>
                            {errors.type && (
                                <p className="text-sm text-red-500">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Interviewer<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Sarah Jenkins"
                                className="w-full h-11 px-4 rounded-lg border border-slate-200"
                                value={formData.interviewerName}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        interviewerName: e.target.value,
                                    });

                                    if (errors.interviewerName) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            interviewerName: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.interviewerName && (
                                <p className="text-sm text-red-500">
                                    {errors.interviewerName}
                                </p>
                            )}
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