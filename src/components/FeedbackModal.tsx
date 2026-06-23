"use client";
import { useState, useEffect } from "react";
import { X, Send, ThumbsUp, HelpCircle, XCircle } from "lucide-react";

export default function FeedbackModal({ isOpen, onClose, onSubmit, candidateName, initialData }: any) {
    const [recommendation, setRecommendation] = useState("");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({
        recommendation: "",
        notes: "",
    });
    const isViewMode = !!initialData;

    useEffect(() => {
        if (initialData) {
            setRecommendation(initialData.recommendation || "");
            setNotes(initialData.note || "");
        } else {
            setRecommendation("");
            setNotes("");
        }

        setErrors({
            recommendation: "",
            notes: "",
        });
    }, [initialData, isOpen]);

    if (!isOpen) return null;
    const handleClose = () => {
        setRecommendation("");
        setNotes("");

        setErrors({
            recommendation: "",
            notes: "",
        });

        onClose();
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isViewMode) {
            onClose();
            return;
        }

        const validationErrors = {
            recommendation: "",
            notes: "",
        };

        if (!recommendation) {
            validationErrors.recommendation =
                "Please select a recommendation";
        }

        if (!notes.trim()) {
            validationErrors.notes =
                "Interview notes are required";
        }

        setErrors(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) {
            return;
        }

        await onSubmit({
            recommendation,
            notes,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-[560px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-6 border-b flex justify-between items-start">
                    <div>
                        <h1 className="font-bold text-lg">{isViewMode ? "Interview Feedback" : "Submit Interview Feedback"}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isViewMode ? "Viewing feedback for" : "Provide your recommendation and notes for"}
                            <span className="font-semibold text-gray-900 ml-1">{candidateName}</span>.
                        </p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                    {/* Recommendation */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Recommendation <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-0 border rounded-lg overflow-hidden">
                            {[
                                { val: "Hire", label: "Hire", icon: ThumbsUp, color: "text-emerald-600" },
                                { val: "Maybe", label: "Maybe", icon: HelpCircle, color: "text-amber-600" },
                                { val: "No-Hire", label: "No-Hire", icon: XCircle, color: "text-red-600" },
                            ].map((opt) => (
                                <button
                                    key={opt.val}
                                    type="button"
                                    disabled={isViewMode}
                                    onClick={() => {
                                        setRecommendation(opt.val);

                                        setErrors((prev) => ({
                                            ...prev,
                                            recommendation: "",
                                        }));
                                    }}
                                    className={`flex flex-col items-center py-4 border-r last:border-0 transition-all 
                                        ${recommendation === opt.val ? "bg-gray-50" : ""}
                                        ${isViewMode ? "cursor-default" : "hover:bg-gray-50"}`}
                                >
                                    <opt.icon size={20} className={recommendation === opt.val ? opt.color : "text-gray-400"} />
                                    <span className="text-xs font-medium mt-1">{opt.label}</span>
                                </button>
                            ))}

                        </div>
                        {errors.recommendation && (
                            <p className="text-sm text-red-500">
                                {errors.recommendation}
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                            placeholder="Describe performance, technical skills, and fit..."
                            rows={4}
                            value={notes}
                            disabled={isViewMode}
                            onChange={(e) => {
                                setNotes(e.target.value);

                                if (errors.notes) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        notes: "",
                                    }));
                                }
                            }}
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-500">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    {!isViewMode && (
                        <button type="submit" className="w-full py-3 bg-[#ad2c00] text-white rounded-lg font-bold flex items-center justify-center gap-2">
                            Submit Feedback <Send size={16} />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}