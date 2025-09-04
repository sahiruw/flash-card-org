"use client";

import React, { useState } from 'react';
import { FlashCard } from '@/types';

interface FlashCardViewerProps {
  cards: FlashCard[];
  onClose: () => void;
}

export default function FlashCardViewer({ cards, onClose }: FlashCardViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Get current card
  const currentCard = cards[currentCardIndex];
  
  // Move to next card
  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };
  
  // Move to previous card
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };
  
  // Toggle showing the answer
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  
  if (!cards.length) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6">
          <h2 className="text-xl font-bold mb-4 text-[color:var(--primary)]">Flash Cards</h2>
          <p className="mb-4">No flash cards available.</p>
          <button 
            onClick={onClose}
            className="w-full btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[color:var(--primary)]">Flash Cards</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <div className="mb-4 text-center text-sm">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
        
        <div className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg p-6 min-h-[200px] mb-6 cursor-pointer transition-all hover:shadow-md"
             onClick={toggleAnswer}>
          <div className="mb-4 text-center text-sm text-gray-500">
            {showAnswer ? "Answer" : "Question"}
          </div>
          <div className="text-center">
            {showAnswer ? currentCard.answer : currentCard.question}
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            {showAnswer ? "(Click to see question)" : "(Click to see answer)"}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={prevCard} 
            disabled={currentCardIndex === 0}
            className={`px-4 py-2 rounded-full ${
              currentCardIndex === 0 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-[color:var(--secondary)] hover:opacity-90"
            }`}
          >
            ← Previous
          </button>
          
          <button 
            onClick={toggleAnswer}
            className="px-4 py-2 rounded-full bg-[color:var(--primary)] text-white hover:opacity-90"
          >
            {showAnswer ? "Show Question" : "Show Answer"}
          </button>
          
          <button 
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            className={`px-4 py-2 rounded-full ${
              currentCardIndex === cards.length - 1 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-[color:var(--secondary)] hover:opacity-90"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
