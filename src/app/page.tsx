"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { getSubjects, getPages } from "@/services/firebase";
import { Subject, Page } from "@/types";

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedSubjects, fetchedPages] = await Promise.all([
          getSubjects(),
          getPages()
        ]);
        
        setSubjects(fetchedSubjects);
        setPages(fetchedPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Filter pages by selected subject
  const filteredPages = selectedSubject 
    ? pages.filter(page => page.subjectId === selectedSubject)
    : pages;

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Unknown";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl px-4 py-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[color:var(--primary)]">Notes</h1>
          <div className="flex gap-2">
            <Link href="/add" className="btn-primary">
              + Add Note
            </Link>
            <Link href="/subjects" className="btn-secondary">
              Manage
            </Link>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="mb-6">
          <select
            className="input w-full md:w-64"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Notes List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[color:var(--primary)]"></div>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="card p-8 text-center">
            {selectedSubject ? (
              <>
                <p className="mb-4">No notes in this subject.</p>
                <button 
                  className="btn-secondary mr-2" 
                  onClick={() => setSelectedSubject("")}
                >
                  View All
                </button>
                <Link href="/add" className="btn-primary">
                  Add Note
                </Link>
              </>
            ) : (
              <>
                <p className="mb-4">No notes yet.</p>
                <Link href="/add" className="btn-primary">
                  Add Note
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPages.map(page => (
              <Link 
                key={page.id} 
                href={`/page/${page.id}`}
                className="card hover:border-[color:var(--primary)] transition-colors"
              >
                <h3 className="font-medium text-lg mb-1 line-clamp-1">{page.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                  {page.content.substring(0, 100).trim()}
                </p>
                <div className="flex justify-between items-center mt-auto text-xs text-gray-500 dark:text-gray-400">
                  <span>{getSubjectName(page.subjectId)}</span>
                  <span>{new Date(page.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <footer className="border-t border-[color:var(--border)] py-2 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="container mx-auto">
          PuccaNotes © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

