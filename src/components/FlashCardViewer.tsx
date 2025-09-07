"use client";

import React, { useState, useEffect, CSSProperties } from 'react';
import { FlashCard } from '@/types';

// Inline styles for 3D transforms that aren't easily handled by Tailwind
const styles = {
  perspectiveStyle: {
    perspective: '1000px',
  } as CSSProperties,
  cardFlipStyle: (rotation: number): CSSProperties => ({
    transform: `rotateY(${rotation}deg)`,
    transition: 'transform 0.6s cubic-bezier(0.38, 0.02, 0.09, 1.66)',
    transformStyle: 'preserve-3d',
  }),
  cardFaceStyle: (isFlipped: boolean): CSSProperties => ({
    backfaceVisibility: 'hidden',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }),
};

interface FlashCardViewerProps {
  cards: FlashCard[];
  onClose: () => void;
}

export default function FlashCardViewer({ cards, onClose }: FlashCardViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  
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
  
  // Toggle showing the answer with animation
  const toggleAnswer = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    // The actual flip is handled by CSS transitions
    // We just need to toggle the state and handle the "midpoint" of the animation
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      
      // Allow new flips after animation completes
      setTimeout(() => {
        setIsFlipping(false);
      }, 300); // Half of the total animation duration
    }, 150); // Time to reach halfway point in the animation
  };
    if (!cards.length) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[color:var(--primary)]/10 blur-2xl"></div>
          <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-[color:var(--accent)]/10 blur-2xl"></div>
          
          <h2 className="text-2xl font-bold mb-4 text-[color:var(--primary)]">Flash Cards</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">No flash cards available for this page yet.</p>
          <button 
            onClick={onClose}
            className="w-full btn-primary rounded-xl py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[color:var(--primary)]/10 blur-2xl"></div>
        <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-[color:var(--accent)]/10 blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-5 relative">
          <h2 className="text-2xl font-bold text-[color:var(--primary)]">Flash Cards</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <div className="mb-5 text-center text-sm text-gray-700 dark:text-gray-300 font-medium relative">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
          {/* 3D Card with flip animation */}
        <div 
          className="relative mb-8"
          style={{ ...styles.perspectiveStyle, height: '280px' }}
        >
          <div 
            className="w-full h-full relative cursor-pointer"
            style={styles.cardFlipStyle(showAnswer ? 180 : 0)}
            onClick={toggleAnswer}
          >
            {/* Question side - front of card */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-[color:var(--card)] to-[color:var(--card)]/80 border border-[color:var(--border)] rounded-xl p-8 shadow-lg flex flex-col items-center justify-center"
              style={styles.cardFaceStyle(false)}
            >
              {/* Decorative elements */}
              <div className="absolute top-2 right-2 w-20 h-20 bg-[color:var(--primary)]/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-3 left-3 w-16 h-16 bg-[color:var(--secondary)]/5 rounded-full blur-lg"></div>
              
              <div className="mb-4 text-center text-sm font-semibold text-[color:var(--primary)] bg-[color:var(--primary)]/10 px-4 py-1 rounded-full">
                Question
              </div>
              <div className="text-center text-[color:var(--foreground)] text-xl font-medium max-w-full overflow-auto">
                {currentCard.question}
              </div>
              <div className="text-center mt-6 text-sm text-[color:var(--primary)]">
                Tap to reveal answer
              </div>
            </div>
            
            {/* Answer side - back of card */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-[color:var(--card)] to-[color:var(--card)]/80 border border-[color:var(--border)] rounded-xl p-8 shadow-lg flex flex-col items-center justify-center"
              style={styles.cardFaceStyle(true)}
            >
              {/* Decorative elements */}
              <div className="absolute bottom-2 right-3 w-24 h-24 bg-[color:var(--accent)]/5 rounded-full blur-xl"></div>
              <div className="absolute top-3 left-2 w-16 h-16 bg-[color:var(--primary)]/5 rounded-full blur-lg"></div>
              
              <div className="mb-4 text-center text-sm font-semibold text-[color:var(--accent)] bg-[color:var(--accent)]/10 px-4 py-1 rounded-full">
                Answer
              </div>
              <div className="text-center text-[color:var(--foreground)] text-xl font-medium max-w-full overflow-auto">
                {currentCard.answer}
              </div>
              <div className="text-center mt-6 text-sm text-[color:var(--accent)]">
                Tap to see question
              </div>
            </div>
          </div>
        </div><div className="flex justify-between items-center">
            <button 
              onClick={prevCard} 
              disabled={currentCardIndex === 0}
              className={`flex items-center px-5 py-2.5 rounded-full font-medium shadow transition-all duration-200 ${
                currentCardIndex === 0 
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50" 
                  : "bg-white dark:bg-gray-700 text-[color:var(--primary)] border border-[color:var(--border)] hover:shadow-md hover:translate-x-[-2px]"
              }`}
              aria-label="Previous card"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button 
              onClick={toggleAnswer}
              disabled={isFlipping}
              className={`px-6 py-2.5 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${isFlipping ? 'opacity-80' : ''}`}
              aria-label="Flip card"
            >
              Flip Card
            </button>
            
            <button 
              onClick={nextCard}
              disabled={currentCardIndex === cards.length - 1}
              className={`flex items-center px-5 py-2.5 rounded-full font-medium shadow transition-all duration-200 ${
                currentCardIndex === cards.length - 1 
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50" 
                  : "bg-white dark:bg-gray-700 text-[color:var(--primary)] border border-[color:var(--border)] hover:shadow-md hover:translate-x-[2px]"
              }`}
              aria-label="Next card"
            >
              Next
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
      </div>
    </div>
  );
}
