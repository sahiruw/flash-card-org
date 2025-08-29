"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import SubjectManager from "@/components/SubjectManager";
import PageList from "@/components/PageList";
import { getSubjects, createSubject, deleteSubject, getPages, deletePage } from "@/services/firebase";
import { Subject, Page } from "@/types";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const handleAddSubject = async (name: string) => {
    try {
      const newSubject = await createSubject(name);
      setSubjects(prev => [...prev, newSubject]);
    } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
    }
  };
  
  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      // Remove pages associated with this subject
      setPages(prev => prev.filter(page => page.subjectId !== id));
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  };
  
  const handleDeletePage = async (id: string) => {
    try {
      await deletePage(id);
      setPages(prev => prev.filter(page => page.id !== id));
    } catch (error) {
      console.error("Error deleting page:", error);
      throw error;
    }
  };
  
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-[color:var(--primary)]">Manage Subjects & Notes</h1>
        
        {isLoading ? (
          <div className="card text-center p-8">
            <p className="text-lg">Loading...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_2fr] gap-8">
            <div>
              <SubjectManager
                subjects={subjects}
                onAddSubject={handleAddSubject}
                onDeleteSubject={handleDeleteSubject}
              />
            </div>
            
            <div>
              <PageList
                pages={pages}
                subjects={subjects}
                onDelete={handleDeletePage}
                selectedSubject={selectedSubject}
                onSubjectChange={handleSubjectChange}
              />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-[color:var(--card)] border-t border-[color:var(--border)] py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="container mx-auto">
          MediNotes Organizer © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
