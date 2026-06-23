"use client";
import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function GenerateOfferModal({ candidate, onClose, onRefresh }: any) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        role: candidate.jobOpening?.title || "",
        salary: "",
        currency: "USD",
        startDate: "",
        manager: "",
        location: "",
    });
    const [errors, setErrors] = useState({
        role: "",
        salary: "",
        currency: "",
        startDate: "",
        manager: "",
        location: "",
    });
    const handleGenerate = async () => {
        const validationErrors = {
            role: "",
            salary: "",
            currency: "",
            startDate: "",
            manager: "",
            location: "",
        };

        if (!formData.role.trim()) {
            validationErrors.role = "Role title is required";
        }

        if (!formData.salary.trim()) {
            validationErrors.salary = "Salary is required";
        }

        if (!formData.currency) {
            validationErrors.currency = "Currency is required";
        }

        if (!formData.startDate) {
            validationErrors.startDate = "Start date is required";
        }

        if (!formData.manager.trim()) {
            validationErrors.manager = "Reporting manager is required";
        }

        if (!formData.location.trim()) {
            validationErrors.location = "Work location is required";
        }

        setErrors(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) {
            return;
        }
        setIsGenerating(true);

        try {
            const response = await fetch("/api/generateOffer", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    candidateId: candidate._id,
                    name: candidate.name,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const { offerUrl, ndaUrl } = await response.json();

                await downloadFile(
                    offerUrl,
                    `Offer_${candidate.name}.pdf`
                );

                await downloadFile(
                    ndaUrl,
                    `NDA_${candidate.name}.pdf`
                );

                onRefresh();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }

    };

    const downloadFile = async (url: string, filename: string) => {
        try {
            // 1. Fetch the file as a blob
            const response = await fetch(url);
            const blob = await response.blob();

            // 2. Create a local URL for the blob
            const blobUrl = window.URL.createObjectURL(blob);

            // 3. Create the temporary link
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", filename);

            // 4. Append and click
            document.body.appendChild(link);
            link.click();

            // 5. Cleanup
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback: if fetch fails (CORS issues), just open the link
            window.open(url, "_blank");
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-[640px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Generate Offer</h2>
                        <p className="text-sm text-gray-500 mt-1">Populate the official offer document for {candidate.name}.</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isGenerating}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Role Title<span className="text-red-500">*</span></label>
                        <input
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"

                            value={formData.role}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                });

                                if (errors.role) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        role: "",
                                    }));
                                }
                            }}
                        />

                        {errors.role && (
                            <p className="text-sm text-red-500">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4 space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Currency<span className="text-red-500">*</span></label>
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"

                                value={formData.currency}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        currency: e.target.value,
                                    });

                                    if (errors.currency) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            currency: "",
                                        }));
                                    }
                                }}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                            {errors.currency && (
                                <p className="text-sm text-red-500">
                                    {errors.currency}
                                </p>
                            )}
                        </div>
                        <div className="col-span-8 space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Salary Amount<span className="text-red-500">*</span></label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                type="number"
                                value={formData.salary}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        salary: e.target.value,
                                    });

                                    if (errors.salary) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            salary: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.salary && (
                                <p className="text-sm text-red-500">
                                    {errors.salary}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Start Date<span className="text-red-500">*</span></label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        startDate: e.target.value,
                                    });

                                    if (errors.startDate) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            startDate: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.startDate && (
                                <p className="text-sm text-red-500">
                                    {errors.startDate}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Reporting Manager<span className="text-red-500">*</span></label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.manager}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        manager: e.target.value,
                                    });

                                    if (errors.manager) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            manager: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.manager && (
                                <p className="text-sm text-red-500">
                                    {errors.manager}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Work Location<span className="text-red-500">*</span></label>
                        <input
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.location}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    location: e.target.value,
                                });

                                if (errors.location) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        location: "",
                                    }));
                                }
                            }}
                        />

                        {errors.location && (
                            <p className="text-sm text-red-500">
                                {errors.location}
                            </p>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isGenerating}
                        className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-6 py-2.5 rounded-lg bg-[#ad2c00] text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Generating...
                            </>
                        ) : (
                            "Generate Offer"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}