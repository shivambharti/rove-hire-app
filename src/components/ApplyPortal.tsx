"use client";

import React, { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function ApplyPortal({
    candidateId,
    name,
    email
}: {
    candidateId: string,
    name: string,
    email: string
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [candidateName, setCandidateName] = useState(name.split(" ")[0]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        setCandidateName(String(data.name).split(" ")[0]);

        try {
            const res = await fetch(`/api/candidates/apply/${candidateId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) setIsSuccess(true);
        } catch (err) {
            console.error("Submission error", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-[600px] mx-auto p-4 flex items-center justify-center min-h-screen">
            {!isSuccess ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full">
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-[#ad2c00] mb-1">Build Your Future at ROVE</h1>
                        <p className="text-sm text-slate-600">Complete the details below to start your journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name & Email */}
                            <div className="col-span-full">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name<span className="text-red-500">*</span></label>
                                <input name="name" defaultValue={name} readOnly className="w-full px-3 py-2 text-sm rounded border border-slate-100 bg-slate-50 text-slate-500 outline-none" />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address<span className="text-red-500">*</span></label>
                                <input name="email" defaultValue={email} readOnly className="w-full px-3 py-2 text-sm rounded border border-slate-100 bg-slate-50 text-slate-500 outline-none" />
                            </div>

                            {/* Contact Details */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone Number<span className="text-red-500">*</span></label>
                                <input name="phoneNumber" type="tel" required className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-2 focus:ring-[#ad2c00]/10 focus:border-[#ad2c00] outline-none" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Current Location<span className="text-red-500">*</span></label>
                                <input name="currentLocation" required className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-2 focus:ring-[#ad2c00]/10 focus:border-[#ad2c00] outline-none" />
                            </div>

                            {/* Role & Notice */}
                            <div className="col-span-full">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Current Role<span className="text-red-500">*</span></label>
                                <input name="currentRole" required className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-2 focus:ring-[#ad2c00]/10 focus:border-[#ad2c00] outline-none" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Notice Period<span className="text-red-500">*</span></label>
                                <select name="noticePeriod" required className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-2 focus:ring-[#ad2c00]/10 focus:border-[#ad2c00] outline-none appearance-none">
                                    <option value="">Select option</option>
                                    <option>Immediate</option>
                                    <option>2 Weeks</option>
                                    <option>1 Month</option>
                                    <option>2+ Months</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Salary Expectation<span className="text-red-500">*</span></label>
                                <input name="salaryExpectation" type="number" required className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-2 focus:ring-[#ad2c00]/10 focus:border-[#ad2c00] outline-none" placeholder="$" />
                            </div>

                            {/* LinkedIn URL - Full span to keep it organized */}
                            <div className="col-span-full">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn Profile URL<span className="text-red-500">*</span></label>
                                <input name="linkedinUrl" type="url" required className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-2 focus:ring-[#ad2c00]/10 focus:border-[#ad2c00] outline-none" />
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-[#ad2c00] text-white py-3 mt-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Submit Application <Send size={14} />
                                </>
                            )}                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                    <h2 className="text-2xl font-bold text-[#ad2c00] mb-2">Application Received!</h2>
                    <p className="text-slate-600 text-sm">Thanks, {candidateName}! We will review your profile within 48 hours.</p>
                </div>
            )}
        </div>
    );
}