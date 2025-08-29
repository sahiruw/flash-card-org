"use client";

import Link from "next/link";
import { useState } from "react";
import { Page } from "@/types";

interface PageListProps {
  pages: Page[];
  subjects: { id: string; name: string }[];
  onDelete: (id: string) => Promise<void>;
  selectedSubject?: string;
  onSubjectChange?: (subjectId: string) => void;
}

export default function PageList({ 
  pages, 
  subjects, 
  onDelete,
  selectedSubject,
  onSubjectChange
}: PageListProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      setIsDeleting(true);
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Error deleting page:", error);
        alert("Failed to delete page. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Filter pages by subject if selectedSubject is provided
  const filteredPages = selectedSubject 
    ? pages.filter(page => page.subjectId === selectedSubject)
    : pages;
  
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Unknown";
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Pages</h2>
        
        {onSubjectChange && (
          <div className="w-56">
            <select
              className="input"
              value={selectedSubject || ""}
              onChange={(e) => onSubjectChange(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {filteredPages.length === 0 ? (
        <p className="text-gray-500 italic">No pages yet. Add your first page to get started.</p>
      ) : (
        <div className="space-y-3">
          {filteredPages.map(page => (
            <div 
              key={page.id} 
              className="py-3 px-4 rounded-md bg-white dark:bg-gray-800 border border-[color:var(--border)]"
            >
              <div className="flex justify-between">
                <Link href={`/page/${page.id}`} className="font-medium text-lg hover:text-[color:var(--accent)]">
                  {page.title}
                </Link>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(page.id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Subject: {getSubjectName(page.subjectId)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(page.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
