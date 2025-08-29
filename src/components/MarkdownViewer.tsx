"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseMarkdownSections } from "@/utils/markdown";

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
              {section.title}
            </button>
          ))}
        </div>
      )}
      
      <div className="prose prose-pink max-w-none dark:prose-invert">
        {activeSection ? (
          <div>
            {sections
              .filter(section => activeSection === section.title)
              .map(section => (
                <div key={section.title}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {`${"#".repeat(section.level)} ${section.title}\n\n${section.content}`}
                  </ReactMarkdown>
                </div>
              ))}
          </div>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
