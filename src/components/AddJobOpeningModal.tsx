"use client";

import React, { useState } from "react";
import { X, Bold, Italic, List, Heading1, Heading2, Link2 } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';

export default function AddJobOpeningModal({
    onClose,
    onJobCreated,
}: {
    onClose: () => void;
    onJobCreated: () => void;
}) {
    const [title, setTitle] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [status, setStatus] = useState("Open");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        skills: "",
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ bulletList: false }),
            Heading.configure({ levels: [1, 2] }),
            BulletList.configure({ HTMLAttributes: { class: 'list-disc ml-5' } }),
            ListItem,
            Link.configure({ openOnClick: false }),
        ],
        content: '',
        onUpdate: () => {
            if (errors.description) {
                setErrors((prev) => ({
                    ...prev,
                    description: "",
                }));
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-4 py-3',
            },
        },
    });

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");

            setErrors((prev) => ({
                ...prev,
                skills: "",
            }));
        }
    };

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();

        const description = editor?.getHTML() || "";

        const validationErrors = {
            title: "",
            description: "",
            skills: "",
        };

        if (!title.trim()) {
            validationErrors.title = "Job title is required";
        }

        const plainText =
            editor?.getText().trim() || "";

        if (!plainText) {
            validationErrors.description =
                "Job description is required";
        }

        if (skills.length === 0) {
            validationErrors.skills =
                "At least one skill is required";
        }

        setErrors(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/jobOpenings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    skills,
                    status,
                }),
            });

            if (response.ok) {
                onJobCreated();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
                <div className="px-8 py-6 border-b border-[#E2E8F0] flex justify-between items-center bg-zinc-50">
                    <h2 className="text-lg font-bold text-zinc-900">New Job Opening</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-zinc-500" /></button>
                </div>

                <form onSubmit={handleCreateJob} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                        {/* Fields: Title, Status, Description, Skills */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 block">Job Title<span className="text-red-500">*</span></label>
                            <input type="text" required value={title} onChange={(e) => {
                                setTitle(e.target.value);

                                if (errors.title) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        title: "",
                                    }));
                                }
                            }} className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm" />
                            {errors.title && (
                                <p className="text-red-500 text-xs">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 block">Status<span className="text-red-500">*</span></label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm bg-white cursor-pointer">
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 block">Description<span className="text-red-500">*</span></label>
                            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
                                <div className="bg-zinc-50 px-4 py-2 border-b flex gap-3 text-zinc-500">
                                    <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="hover:text-[#ad2c00]"><Bold className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="hover:text-[#ad2c00]"><Italic className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="hover:text-[#ad2c00]"><Heading1 className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="hover:text-[#ad2c00]"><Heading2 className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="hover:text-[#ad2c00]"><List className="w-4 h-4" /></button>
                                </div>
                                <EditorContent editor={editor} />
                            </div>
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                        {/* Skills */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 block">Required Skills<span className="text-red-500">*</span></label>
                            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm" placeholder="Type and press Enter" />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-[#ad2c00]/10 text-[#ad2c00] rounded-full text-xs font-semibold flex items-center gap-1">
                                        {skill} <X className="w-3 h-3 cursor-pointer" onClick={() => setSkills(skills.filter((_, i) => i !== index))} />
                                    </span>
                                ))}
                                {errors.skills && (
                                    <p className="text-red-500 text-xs">
                                        {errors.skills}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 border-t border-[#E2E8F0] bg-white flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold">Discard</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-[#ad2c00] text-white rounded-xl text-sm font-semibold hover:opacity-90">
                            {isSubmitting ? "Publishing..." : "Publish Opening"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}