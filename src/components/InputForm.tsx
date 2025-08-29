"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { extractMarkdown } from "@/utils/markdown";

interface InputFormProps {
  onSubmit: (title: string, content: string, subjectId: string) => Promise<void>;
  subjects: { id: string; name: string }[];
}

export default function InputForm({ onSubmit, subjects }: InputFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [rawInput, setRawInput] = useState("");
  const [extractedMarkdown, setExtractedMarkdown] = useState("");
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRawInput(value);
    
    // Auto-extract markdown if the text looks like it contains markdown
    if (value.includes("---") || value.includes("#")) {
      const extracted = extractMarkdown(value);
      setExtractedMarkdown(extracted);
    }
  };
  
  const handleExtract = () => {
    const extracted = extractMarkdown(rawInput);
    setExtractedMarkdown(extracted);
  };
  
  // Count the number of sections in the markdown
  const getSectionCount = (markdown: string): number => {
    // Count sections divided by "---" markers
    const dividerSections = (markdown.match(/\n---\s*\n/g) || []).length + 1;
    
    // Count header sections (# headers)
    const headerMatches = markdown.match(/^#{1,6}\s+.+$/gm) || [];
    
    // Return the higher count, with a minimum of 1 section
    return Math.max(dividerSections, headerMatches.length, 1);
  };
  
  const handleFormSubmit = async (data: any) => {
    if (!data.subjectId) {
      alert("Please select a subject");
      return;
    }
    
    setIsProcessing(true);
    try {
      await onSubmit(data.title, extractedMarkdown || data.content, data.subjectId);
      reset();
      setRawInput("");
      setExtractedMarkdown("");
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Failed to save the page. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="card space-y-4">
      <div>
        <label htmlFor="title" className="block font-medium mb-1">
          Page Title
        </label>
        <input
          id="title"
          type="text"
          className="input"
          placeholder="Enter a title for this page"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="subject" className="block font-medium mb-1">
          Subject
        </label>
        <select 
          id="subject" 
          className="input"
          {...register("subjectId", { required: "Subject is required" })}
        >
          <option value="">Select a subject</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {errors.subjectId && (
          <p className="text-red-500 text-sm mt-1">{errors.subjectId.message as string}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content" className="block font-medium mb-1">
          Input Text
        </label>
        <textarea
          id="content"
          className="textarea"
          placeholder="Paste your text here"
          value={rawInput}
          onChange={handleTextChange}
        />
        <button 
          type="button" 
          className="btn-secondary mt-2"
          onClick={handleExtract}
        >
          Extract Markdown
        </button>
      </div>
        {extractedMarkdown && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="extractedContent" className="block font-medium">
              Extracted Markdown
            </label>
            <span className="text-sm text-[color:var(--primary)] font-medium bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md">
              {getSectionCount(extractedMarkdown)} {getSectionCount(extractedMarkdown) === 1 ? 'section' : 'sections'} detected
            </span>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            <p>Sections are defined by headers (#, ##, etc.) or by "---" dividers on their own lines</p>
          </div>          <textarea
            id="extractedContent"
            className="textarea"
            value={extractedMarkdown}
            {...register("content", {
              onChange: (e) => setExtractedMarkdown(e.target.value)
            })}
          />
          {extractedMarkdown.includes('---') && (
            <div className="text-sm text-[color:var(--accent)] mt-2">
              <p>✓ Multiple sections with "---" dividers detected</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isProcessing}
        >
          {isProcessing ? "Saving..." : "Save Page"}
        </button>
      </div>
    </form>
  );
}
