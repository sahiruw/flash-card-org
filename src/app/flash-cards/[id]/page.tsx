"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import FlashCardViewer from "@/components/FlashCardViewer";
import { getPage, getFlashCardsByPageId } from "@/services/firebase";
import { FlashCard, Page } from "@/types";

export default function FlashCardsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  
  useEffect(() => {
    async function loadData() {
      try {
        // Load page info
        const fetchedPage = await getPage(params.id);
        if (!fetchedPage) {
          setError("Page not found");
          return;
        }
        setPage(fetchedPage);
        
        // Load flash cards
        const fetchedCards = await getFlashCardsByPageId(params.id);
        setFlashCards(fetchedCards);
        
        if (fetchedCards.length === 0) {
          setError("No flash cards found for this page");
        }
      } catch (err) {
        console.error("Error loading flash cards:", err);
        setError("Failed to load flash cards");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [params.id]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl px-4 py-6 flex-grow">
        <div className="mb-6">
          <Link 
            href={`/page/${params.id}`}
            className="inline-block mb-2 text-[color:var(--primary)] hover:underline"
          >
            ← Back to note
          </Link>
        </div>
        
        {isLoading ? (
          <div className="card text-center p-8">
            <p className="text-lg">Loading flash cards...</p>
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-red-500 mb-4">{error}</div>
            <Link href={`/page/${params.id}`} className="btn-primary">
              Return to Note
            </Link>
          </div>
        ) : (
          <>
            <div className="card">
              <h1 className="text-2xl font-bold mb-4 text-[color:var(--accent)]">
                Flash Cards: {page?.title}
              </h1>
              
              <div className="mb-6">
                <p className="text-gray-500">
                  {flashCards.length} flash cards available for review
                </p>
              </div>
              
              <button
                onClick={() => setShowViewer(true)}
                className="btn-primary mb-6"
              >
                Start Review
              </button>
              
              <div className="grid gap-4 md:grid-cols-2">
                {flashCards.map((card) => (
                  <div 
                    key={card.id} 
                    className="border border-[color:var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium mb-2">{card.question}</div>
                    <div className="text-sm text-gray-500">
                      Click to reveal answer
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {showViewer && (
              <FlashCardViewer
                cards={flashCards}
                onClose={() => setShowViewer(false)}
              />
            )}
          </>
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
