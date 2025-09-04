"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import MarkdownViewer from "@/components/MarkdownViewer";
import FlashCardViewer from "@/components/FlashCardViewer";
import { getPage, getSubjects, createFlashCards, getFlashCardsByPageId } from "@/services/firebase";
import { generateFlashCards } from "@/utils/ai";
import { Page, Subject, FlashCard } from "@/types";

export default function PageView({ params }: { params: { id: string } }) {
  const [page, setPage] = useState<Page | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    async function loadPage() {
      try {
        const fetchedPage = await getPage(params.id);
        
        if (!fetchedPage) {
          setError("Page not found");
          return;
        }
        
        setPage(fetchedPage);
        
        // Load subject information
        const subjects = await getSubjects();
        const pageSubject = subjects.find(s => s.id === fetchedPage.subjectId);
        setSubject(pageSubject || null);
        
        // Load existing flash cards
        const existingCards = await getFlashCardsByPageId(params.id);
        setFlashCards(existingCards);
      } catch (err) {
        console.error("Error fetching page:", err);
        setError("Failed to load the page");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPage();
  }, [params.id]);
  
  const handleGenerateFlashCards = async () => {
    if (!page) return;
    
    setIsGenerating(true);
    try {
      // Generate flash cards using AI
      const generatedCards = await generateFlashCards(page.title, page.content);
      
      // Save to Firebase
      const savedCards = await createFlashCards(params.id, generatedCards);
      
      // Update state
      setFlashCards(savedCards);
      setShowFlashCards(true);
    } catch (error) {
      console.error("Error generating flash cards:", error);
      alert("Failed to generate flash cards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl px-4 py-4 sm:py-8 flex-grow">
        {isLoading ? (
          <div className="card text-center p-8">
            <p className="text-lg">Loading...</p>
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-red-500 mb-4">{error}</div>
            <Link href="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        ) : page ? (
          <>
            <div className="flex items-center justify-between mb-6">              <div>
                <Link 
                  href="/subjects" 
                  className="inline-block mb-2 text-[color:var(--primary)] hover:underline"
                >
                  ← Back to all notes
                </Link>
                {subject && (
                  <div className="text-sm text-gray-500">
                    Subject: {subject.name}
                  </div>
                )}
              </div>              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="text-sm text-gray-500">
                  Created: {new Date(page.createdAt).toLocaleDateString()}
                </div>
                <div className="ml-auto flex gap-2">
                  {flashCards.length > 0 && (
                    <Link
                      href={`/flash-cards/${params.id}`}
                      className="btn-secondary"
                    >
                      Flash Cards
                    </Link>
                  )}
                  <button
                    onClick={flashCards.length > 0 ? () => setShowFlashCards(true) : handleGenerateFlashCards}
                    className="btn-primary"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin inline-block mr-2">⟳</span>
                        Generating...
                      </>
                    ) : flashCards.length > 0 ? (
                      "View Flash Cards"
                    ) : (
                      "Generate Flash Cards"
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <MarkdownViewer title={page.title} content={page.content} />
            
            {showFlashCards && (
              <FlashCardViewer 
                cards={flashCards}
                onClose={() => setShowFlashCards(false)}
              />
            )}
          </>
        ) : (
          <div className="card text-center">
            <p className="mb-4">The requested page could not be found.</p>
            <Link href="/" className="btn-primary">
              Return to Home
            </Link>
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
