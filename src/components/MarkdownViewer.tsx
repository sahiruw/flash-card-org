"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseMarkdownSections } from "@/utils/markdown";
import type { Components } from "react-markdown";

interface MarkdownViewerProps {
  content: string;
  title: string;
}

interface Section {
  title: string;
  content: string;
  level: number;
}

export default function MarkdownViewer({ content, title }: MarkdownViewerProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  useEffect(() => {
    const parsedSections = parseMarkdownSections(content);
    setSections(parsedSections);
    
    if (parsedSections.length > 0) {
      setActiveSection(parsedSections[0].title);
    }
  }, [content]);
    // Custom components for ReactMarkdown
  const components: Components = {
    // Special handling for horizontal rules (section dividers)
    hr: () => (
      <div className="my-8 flex items-center justify-center">
        <div className="w-16 h-1 bg-[color:var(--primary)] rounded-full mx-1 animate-pulse"></div>
        <div className="w-4 h-4 bg-[color:var(--secondary)] rounded-full mx-1"></div>
        <div className="w-16 h-1 bg-[color:var(--primary)] rounded-full mx-1 animate-pulse"></div>
      </div>
    ),
    // Enhanced table with responsive overflow
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-8 rounded-lg border border-[color:var(--border)]">
        <table className="min-w-full divide-y divide-[color:var(--border)]" {...props}>
          {children}
        </table>
      </div>
    ),
    // Styled table header
    thead: ({ children, ...props }) => (
      <thead className="bg-pink-50 dark:bg-pink-900/30" {...props}>
        {children}
      </thead>
    ),
    // Styled table body
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-[color:var(--border)]" {...props}>
        {children}
      </tbody>
    ),
    // Styled table header cells
    th: ({ children, ...props }) => (
      <th 
        className="px-4 py-3 text-left text-sm font-medium text-[color:var(--primary)] uppercase tracking-wider" 
        {...props}
      >
        {children}
      </th>
    ),
    // Styled table data cells
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-sm" {...props}>
        {children}
      </td>
    ),
    // Hover effect for rows
    tr: ({ children, ...props }) => (
      <tr className="hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-colors" {...props}>
        {children}
      </tr>
    ),
  };
  
  return (
    <div className="card overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-center text-[color:var(--accent)]">{title}</h1>
      
      {sections.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.title}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
              activeSection === section.title
                ? "bg-[color:var(--primary)] text-white"
                : "bg-[color:var(--secondary)] hover:bg-opacity-80"
              }`}
              onClick={() => setActiveSection(section.title)}
            >
              {section.title.replace(/[#*]/g, "").trim()}
            </button>
          ))}
        </div>
      )}
      
      <div className="prose prose-pink max-w-none dark:prose-invert markdown-content">
        {activeSection ? (
          <div>
            {sections
              .filter(section => activeSection === section.title)
              .map(section => (
                <div key={section.title}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={components}
                  >
                    {`${"#".repeat(section.level)} ${section.title}\n\n${section.content}`}
                  </ReactMarkdown>
                </div>
              ))}
          </div>
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
