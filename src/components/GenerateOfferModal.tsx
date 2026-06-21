"use client";
import React, { useState } from "react";

export default function GenerateOfferModal({ candidate, onClose, onRefresh }: any) {
    const [formData, setFormData] = useState({
        role: candidate.jobOpening?.title || "",
        salary: "",
        currency: "USD",
        startDate: "",
        manager: "",
        location: candidate.currentLocation || "",
    });

    const handleGenerate = async () => {
        const response = await fetch("/api/generateOffer", {
            method: "POST",
            body: JSON.stringify({ ...formData, candidateId: candidate._id, name: candidate.name }),
            headers: { "Content-Type": "application/json" },
        });
        console.log("responseoffer", response)
        if (response.ok) {
            const { offerUrl, ndaUrl } = await response.json();

            // Helper to trigger download
            const downloadFile = (url: string, filename: string) => {
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            };

            // Trigger both downloads
            downloadFile(offerUrl, `Offer_${candidate.name}.pdf`);
            // downloadFile(ndaUrl, `NDA_${candidate.name}.pdf`);

            // onRefresh();
            // onClose();
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
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Role Title</label>
                        <input
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4 space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Currency</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.currency}
                                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>
                        <div className="col-span-8 space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Salary Amount</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="e.g. 1,850,000"
                                type="number"
                                onChange={e => setFormData({ ...formData, salary: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Start Date</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                type="date"
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Reporting Manager</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="Name"
                                onChange={e => setFormData({ ...formData, manager: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="px-6 py-2.5 rounded-lg bg-[#ad2c00] text-white font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        Generate Offer
                    </button>
                </div>
            </div>
        </div>
    );
}