"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, FileText, Trash2, UserPlus, Loader2, Check, Copy } from "lucide-react";

export default function AddCandidateModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: State for Success UI
  const [successData, setSuccessData] = useState<{ magicLink: string; name: string } | null>(null);
  
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const jobRef = useRef<HTMLSelectElement>(null);
  const [jobOpenings, setJobOpenings] = useState<{ _id: string; title: string, status: string }[]>([]);

  useEffect(() => {
    fetch("/api/jobOpenings")
      .then(res => res.json())
      .then(setJobOpenings)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", nameRef.current?.value || "");
    formData.append("email", emailRef.current?.value || "");
    formData.append("jobOpening", jobRef.current?.value || "");
    if (file) formData.append("resume", file);

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Set success state with data from API
        setSuccessData({ magicLink: data.magicLink, name: nameRef.current?.value || "Candidate" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      alert("Error saving candidate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (successData?.magicLink) {
      navigator.clipboard.writeText(successData.magicLink);
      alert("Link copied!");
    }
  };

  // --- RENDER SUCCESS VIEW ---
  if (successData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <section className="bg-white w-full max-w-[560px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="h-1 bg-[#ad2c00] w-full"></div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Candidate successfully added!</h3>
            <p className="text-gray-500 mb-8">{successData.name} has been added to the pipeline.</p>
            
            <div className="w-full bg-gray-50 border rounded-lg p-6 mb-8 text-left">
              <p className="text-sm font-bold text-[#ad2c00] uppercase mb-2">Candidate Magic Link</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-white border rounded px-3 py-2 text-sm truncate">{successData.magicLink}</code>
                <button onClick={copyToClipboard} className="bg-[#ad2c00] text-white px-4 rounded-lg flex items-center gap-2">
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
            
            <button onClick={onClose} className="w-full border py-3 rounded-lg hover:bg-gray-50 font-bold">
              Close
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <section className="bg-white w-full max-w-[600px] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <header className="px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Add New Candidate</h2>
            <p className="text-sm text-gray-500">Populate the pipeline with fresh talent.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Candidate Name</label>
              <input ref={nameRef} className="w-full p-3 border rounded-lg outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input ref={emailRef} className="w-full p-3 border rounded-lg outline-none" type="email" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Job Opening</label>
            <select ref={jobRef} className="w-full h-11 px-4 border rounded-lg bg-white" required>
              <option value="">Choose a role...</option>
              {jobOpenings.filter(j => j.status === "Open").map((job) => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Resume</label>
            {!file ? (
              <label className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                <Upload className="text-[#ad2c00] mb-2" />
                <span className="font-bold">Click to upload resume</span>
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2"><FileText /> {file.name}</div>
                <button type="button" onClick={() => setFile(null)} className="text-red-500"><Trash2 size={18} /></button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#ad2c00] text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Add Candidate <UserPlus size={18} /></>}
          </button>
        </form>
      </section>
    </div>
  );
}