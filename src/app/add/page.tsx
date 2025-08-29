"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import InputForm from "@/components/InputForm";
import SubjectManager from "@/components/SubjectManager";
import { getSubjects, createSubject, deleteSubject, createPage } from "@/services/firebase";
import { Subject } from "@/types";

export default function AddPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    async function loadSubjects() {
      try {
        const fetchedSubjects = await getSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSubjects();
  }, []);
  
  const handleAddSubject = async (name: string) => {
    setIsCreatingSubject(true);
    try {
      const newSubject = await createSubject(name);
      setSubjects(prev => [...prev, newSubject]);
    } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
    } finally {
      setIsCreatingSubject(false);
    }
  };
  
  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  };
  
  const handleSubmitPage = async (title: string, content: string, subjectId: string) => {
    try {
      const newPage = await createPage(title, content, subjectId);
      router.push(`/page/${newPage.id}`);
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-[color:var(--primary)]">Add New Note</h1>
        
        {isLoading ? (
          <div className="card text-center p-8">
            <p className="text-lg">Loading...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div>
              <InputForm 
                onSubmit={handleSubmitPage}
                subjects={subjects}
              />
            </div>
            
            <div>
              <SubjectManager
                subjects={subjects}
                onAddSubject={handleAddSubject}
                onDeleteSubject={handleDeleteSubject}
              />
            </div>
          </div>
        )}
      </main>
        <footer className="bg-[color:var(--card)] border-t border-[color:var(--border)] py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="container mx-auto">
          PuccaNotes Organizer © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
