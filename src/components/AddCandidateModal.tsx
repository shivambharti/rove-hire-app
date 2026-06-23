"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, FileText, Trash2, UserPlus, Loader2, Check, Copy } from "lucide-react";


export default function AddCandidateModal({
  onClose,
  onCandidateAdded,
}: {
  onClose: () => void;
  onCandidateAdded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  // NEW: State for Success UI
  const [successData, setSuccessData] = useState<{ magicLink: string; name: string } | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const jobRef = useRef<HTMLSelectElement>(null);
  const [jobOpenings, setJobOpenings] = useState<{ _id: string; title: string, status: string }[]>([]);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    jobOpening: "",
    resume: "",
  });
  useEffect(() => {
    fetch("/api/jobOpenings")
      .then(res => res.json())
      .then(setJobOpenings)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      name: "",
      email: "",
      jobOpening: "",
      resume: "",
    };

    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";
    const jobOpening = jobRef.current?.value || "";

    if (!name) {
      validationErrors.name = "Candidate name is required";
    }

    if (!email) {
      validationErrors.email = "Email address is required";
    }

    if (!jobOpening) {
      validationErrors.jobOpening = "Please select a job opening";
    }

    if (!file) {
      validationErrors.resume = "Resume is required";
    }

    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("jobOpening", jobOpening);

    if (file) {
      formData.append("resume", file);
    }

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        setSuccessData({
          magicLink: data.magicLink,
          name,
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      alert("Error saving candidate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!successData?.magicLink) return;

    await navigator.clipboard.writeText(successData.magicLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
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
                <button
                  onClick={copyToClipboard}
                  className="bg-[#ad2c00] text-white px-4 rounded-lg flex items-center gap-2 min-w-[110px] justify-center"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
                {copied && (
                  <p className="mt-3 text-sm text-green-600 font-medium">
                    ✓ Magic link copied to clipboard
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                onCandidateAdded();
                onClose();
              }}
              className="w-full border py-3 rounded-lg hover:bg-gray-50 font-bold"
            >
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
              <label className="text-sm font-medium text-gray-700">Candidate Name<span className="text-red-500">*</span></label>
              <input ref={nameRef} className="w-full p-3 border rounded-lg outline-none" required />
              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address<span className="text-red-500">*</span></label>
              <input ref={emailRef} className="w-full p-3 border rounded-lg outline-none" type="email" required />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Job Opening<span className="text-red-500">*</span></label>
            <select ref={jobRef} className="w-full h-11 px-4 border rounded-lg bg-white" required>
              <option value="">Choose a role...</option>
              {jobOpenings.filter(j => j.status === "Open").map((job) => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
            {errors.jobOpening && (
              <p className="text-sm text-red-500">
                {errors.jobOpening}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Resume <span className="text-red-500">*</span>
            </label>

            {!file ? (
              <label className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                <Upload className="text-[#ad2c00] mb-2" />

                <span className="font-bold">
                  Click to upload resume
                </span>

                <span className="text-xs text-gray-500 mt-1">
                  PDF only • Maximum 10 MB
                </span>

                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];

                    if (!selectedFile) return;

                    if (
                      selectedFile.type !== "application/pdf" &&
                      !selectedFile.name.toLowerCase().endsWith(".pdf")
                    ) {
                      setErrors((prev) => ({
                        ...prev,
                        resume: "Only PDF files are allowed",
                      }));
                      return;
                    }

                    if (selectedFile.size > 10 * 1024 * 1024) {
                      setErrors((prev) => ({
                        ...prev,
                        resume: "Resume size cannot exceed 10 MB",
                      }));
                      return;
                    }

                    setErrors((prev) => ({
                      ...prev,
                      resume: "",
                    }));

                    setFile(selectedFile);
                  }}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setErrors((prev) => ({
                      ...prev,
                      resume: "",
                    }));
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}

            {errors.resume && (
              <p className="text-sm text-red-500">
                {errors.resume}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ad2c00] text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50
            disabled:cursor-not-allowed "
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Add Candidate <UserPlus size={18} /></>}
          </button>
        </form>
      </section>
    </div>
  );
}