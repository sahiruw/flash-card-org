import { collection, addDoc, getDocs, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Page, Subject, FlashCard } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Collection references
const subjectsCollection = collection(db, "subjects");
const pagesCollection = collection(db, "pages");
const cardsCollection = collection(db, "cards");

// Cache implementation
interface Cache<T> {
  data: Record<string, T>;
  timestamp: Record<string, number>;
  collectionTimestamp: number;
}

interface CacheOptions {
  maxAge?: number; // Maximum age of cached data in milliseconds
  bypassCache?: boolean; // Force bypass cache
}

// Default cache options
const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  bypassCache: false,
};

// Initialize caches
const subjectsCache: Cache<Subject> = { data: {}, timestamp: {}, collectionTimestamp: 0 };
const pagesCache: Cache<Page> = { data: {}, timestamp: {}, collectionTimestamp: 0 };
// Cards cache is different since we store arrays of flash cards by page ID
const cardsCache: { 
  data: Record<string, FlashCard[]>;
  timestamp: Record<string, number>;
  collectionTimestamp: number;
} = { data: {}, timestamp: {}, collectionTimestamp: 0 };

// Helper function to check if cached data is still valid
function isCacheValid<T>(cache: Cache<T> | typeof cardsCache, key: string, options: CacheOptions = DEFAULT_CACHE_OPTIONS): boolean {
  if (options.bypassCache) return false;
  
  const now = Date.now();
  const timestamp = cache.timestamp[key];
  
  if (!timestamp) return false;
  
  return now - timestamp < (options.maxAge || DEFAULT_CACHE_OPTIONS.maxAge!);
}

// Helper function to check if collection cache is still valid
function isCollectionCacheValid<T>(cache: Cache<T> | typeof cardsCache, options: CacheOptions = DEFAULT_CACHE_OPTIONS): boolean {
  if (options.bypassCache) return false;
  
  const now = Date.now();
  
  if (!cache.collectionTimestamp) return false;
  
  return now - cache.collectionTimestamp < (options.maxAge || DEFAULT_CACHE_OPTIONS.maxAge!);
}

// Subject operations
export async function createSubject(name: string): Promise<Subject> {
  const newSubject = {
    id: uuidv4(),
    name,
    createdAt: Date.now(),
  };
  
  await addDoc(subjectsCollection, newSubject);
  
  // Update cache
  subjectsCache.data[newSubject.id] = newSubject;
  subjectsCache.timestamp[newSubject.id] = Date.now();
  subjectsCache.collectionTimestamp = 0; // Invalidate collection cache
  
  return newSubject;
}

export async function getSubjects(options: CacheOptions = {}): Promise<Subject[]> {
  // Check if we can use the cached collection
  if (isCollectionCacheValid(subjectsCache, options)) {
    return Object.values(subjectsCache.data).sort((a, b) => a.name.localeCompare(b.name));
  }
  
  const q = query(subjectsCollection, orderBy("name", "asc"));
  const querySnapshot = await getDocs(q);
  
  // Clear and update cache
  subjectsCache.data = {};
  subjectsCache.timestamp = {};
  subjectsCache.collectionTimestamp = Date.now();
  
  const subjects = querySnapshot.docs.map(doc => {
    const data = doc.data();
    const subject: Subject = {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
    };
    
    // Update individual cache
    subjectsCache.data[subject.id] = subject;
    subjectsCache.timestamp[subject.id] = Date.now();
    
    return subject;
  });
  
  return subjects;
}

export async function deleteSubject(subjectId: string): Promise<void> {
  // First delete all pages associated with this subject
  const pagesQuery = query(pagesCollection, where("subjectId", "==", subjectId));
  const pagesSnapshot = await getDocs(pagesQuery);
  
  const deletePromises = pagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  // Then delete the subject documents that match this ID
  const subjectsQuery = query(subjectsCollection, where("id", "==", subjectId));
  const subjectsSnapshot = await getDocs(subjectsQuery);
  
  const subjectDeletePromises = subjectsSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(subjectDeletePromises);
  
  // Update cache
  delete subjectsCache.data[subjectId];
  delete subjectsCache.timestamp[subjectId];
  subjectsCache.collectionTimestamp = 0; // Invalidate collection cache
  
  // Invalidate pages cache for this subject
  Object.keys(pagesCache.data).forEach(pageId => {
    if (pagesCache.data[pageId].subjectId === subjectId) {
      delete pagesCache.data[pageId];
      delete pagesCache.timestamp[pageId];
    }
  });
  pagesCache.collectionTimestamp = 0; // Invalidate pages collection cache
}

// Page operations
export async function createPage(title: string, content: string, subjectId: string): Promise<Page> {
  const newPage = {
    id: uuidv4(),
    title,
    content,
    subjectId,
    createdAt: Date.now(),
  };
  
  await addDoc(pagesCollection, newPage);
  
  // Update cache
  pagesCache.data[newPage.id] = newPage;
  pagesCache.timestamp[newPage.id] = Date.now();
  pagesCache.collectionTimestamp = 0; // Invalidate collection cache
  
  return newPage;
}

export async function getPages(subjectId?: string, options: CacheOptions = {}): Promise<Page[]> {
  // Generate cache key for this query
  const cacheKey = subjectId ? `subject:${subjectId}` : 'all';
  
  // Check if we can use the cached collection
  if (isCollectionCacheValid(pagesCache, options)) {
    // If we have a valid collection cache, filter by subject if needed
    const pages = Object.values(pagesCache.data);
    if (subjectId) {
      return pages
        .filter(page => page.subjectId === subjectId)
        .sort((a, b) => b.createdAt - a.createdAt);
    } else {
      return pages.sort((a, b) => b.createdAt - a.createdAt);
    }
  }
  
  let q;
  
  if (subjectId) {
    q = query(pagesCollection, where("subjectId", "==", subjectId), orderBy("createdAt", "desc"));
  } else {
    q = query(pagesCollection, orderBy("createdAt", "desc"));
  }
  
  const querySnapshot = await getDocs(q);
  
  // If loading all pages, reset cache
  if (!subjectId) {
    pagesCache.data = {};
    pagesCache.timestamp = {};
    pagesCache.collectionTimestamp = Date.now();
  }
  
  const pages = querySnapshot.docs.map(doc => {
    const data = doc.data();
    const page: Page = {
      id: data.id,
      title: data.title,
      content: data.content,
      subjectId: data.subjectId,
      createdAt: data.createdAt,
    };
    
    // Update individual cache
    pagesCache.data[page.id] = page;
    pagesCache.timestamp[page.id] = Date.now();
    
    return page;
  });
  
  // If we loaded all pages, update collection timestamp
  if (!subjectId) {
    pagesCache.collectionTimestamp = Date.now();
  }
  
  return pages;
}

export async function getPage(id: string, options: CacheOptions = {}): Promise<Page | null> {
  // Check if we have a valid cache for this page
  if (isCacheValid(pagesCache, id, options)) {
    return pagesCache.data[id];
  }
  
  const q = query(pagesCollection, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const data = querySnapshot.docs[0].data();
  const page: Page = {
    id: data.id,
    title: data.title,
    content: data.content,
    subjectId: data.subjectId,
    createdAt: data.createdAt,
  };
  
  // Update cache
  pagesCache.data[id] = page;
  pagesCache.timestamp[id] = Date.now();
  
  return page;
}

export async function deletePage(id: string): Promise<void> {
  const q = query(pagesCollection, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    await deleteDoc(querySnapshot.docs[0].ref);
    
    // Update cache
    delete pagesCache.data[id];
    delete pagesCache.timestamp[id];
    pagesCache.collectionTimestamp = 0; // Invalidate collection cache
    
    // Invalidate flash cards cache for this page
    delete cardsCache.data[id];
    delete cardsCache.timestamp[id];
  }
}

// Flash card operations
export async function createFlashCards(
  pageId: string,
  cards: Array<{ question: string; answer: string }>
): Promise<FlashCard[]> {
  const createdCards: FlashCard[] = [];
  
  const createPromises = cards.map(async (card) => {
    const newCard: FlashCard = {
      id: uuidv4(),
      pageId,
      question: card.question,
      answer: card.answer,
      createdAt: Date.now(),
    };
    
    await addDoc(cardsCollection, newCard);
    createdCards.push(newCard);
  });
  
  await Promise.all(createPromises);
  
  // Update cache
  // If we already have cards for this page, append the new ones
  const existingCards = cardsCache.data[pageId] || [];
  cardsCache.data[pageId] = [...createdCards, ...existingCards];
  cardsCache.timestamp[pageId] = Date.now();
  
  return createdCards;
}

export async function getFlashCardsByPageId(pageId: string, options: CacheOptions = {}): Promise<FlashCard[]> {
  // Check if we have a valid cache for this page's flash cards
  if (isCacheValid(cardsCache, pageId, options)) {
    return cardsCache.data[pageId] || [];
  }
  
  const q = query(cardsCollection, where("pageId", "==", pageId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // Cache the empty result
    cardsCache.data[pageId] = [];
    cardsCache.timestamp[pageId] = Date.now();
    return [];
  }
  
  const flashCards = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.id,
      pageId: data.pageId,
      question: data.question,
      answer: data.answer,
      createdAt: data.createdAt,
    };
  });
  
  // Update cache
  cardsCache.data[pageId] = flashCards;
  cardsCache.timestamp[pageId] = Date.now();
  
  return flashCards;
}

// Function to clear all caches
export function clearAllCaches(): void {
  subjectsCache.data = {};
  subjectsCache.timestamp = {};
  subjectsCache.collectionTimestamp = 0;
  
  pagesCache.data = {};
  pagesCache.timestamp = {};
  pagesCache.collectionTimestamp = 0;
  
  cardsCache.data = {};
  cardsCache.timestamp = {};
  cardsCache.collectionTimestamp = 0;
}

// Function to invalidate specific cache
export function invalidateCache(type: 'subjects' | 'pages' | 'cards', id?: string): void {
  switch (type) {
    case 'subjects':
      if (id) {
        delete subjectsCache.data[id];
        delete subjectsCache.timestamp[id];
      } else {
        subjectsCache.data = {};
        subjectsCache.timestamp = {};
        subjectsCache.collectionTimestamp = 0;
      }
      break;
    case 'pages':
      if (id) {
        delete pagesCache.data[id];
        delete pagesCache.timestamp[id];
      } else {
        pagesCache.data = {};
        pagesCache.timestamp = {};
        pagesCache.collectionTimestamp = 0;
      }
      break;
    case 'cards':
      if (id) {
        delete cardsCache.data[id];
        delete cardsCache.timestamp[id];
      } else {
        cardsCache.data = {};
        cardsCache.timestamp = {};
        cardsCache.collectionTimestamp = 0;
      }
      break;
  }
}
