import { collection, addDoc, getDocs, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Page, Subject, FlashCard } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Collection references
const subjectsCollection = collection(db, "subjects");
const pagesCollection = collection(db, "pages");
const cardsCollection = collection(db, "cards");

// Subject operations
export async function createSubject(name: string): Promise<Subject> {
  const newSubject = {
    id: uuidv4(),
    name,
    createdAt: Date.now(),
  };
  
  await addDoc(subjectsCollection, newSubject);
  return newSubject;
}

export async function getSubjects(): Promise<Subject[]> {
  const q = query(subjectsCollection, orderBy("name", "asc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
    };
  });
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
  return newPage;
}

export async function getPages(subjectId?: string): Promise<Page[]> {
  let q;
  
  if (subjectId) {
    q = query(pagesCollection, where("subjectId", "==", subjectId), orderBy("createdAt", "desc"));
  } else {
    q = query(pagesCollection, orderBy("createdAt", "desc"));
  }
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      subjectId: data.subjectId,
      createdAt: data.createdAt,
    };
  });
}

export async function getPage(id: string): Promise<Page | null> {
  const q = query(pagesCollection, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const data = querySnapshot.docs[0].data();
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    subjectId: data.subjectId,
    createdAt: data.createdAt,
  };
}

export async function deletePage(id: string): Promise<void> {
  const q = query(pagesCollection, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    await deleteDoc(querySnapshot.docs[0].ref);
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
  return createdCards;
}

export async function getFlashCardsByPageId(pageId: string): Promise<FlashCard[]> {
  const q = query(cardsCollection, where("pageId", "==", pageId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.id,
      pageId: data.pageId,
      question: data.question,
      answer: data.answer,
      createdAt: data.createdAt,
    };
  });
}
