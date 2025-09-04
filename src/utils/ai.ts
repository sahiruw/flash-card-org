/**
 * Utility functions for working with the Google Gemini API
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

/**
 * Generates flash cards from markdown content using the Google Gemini API
 * @param title The title of the content
 * @param content The markdown content to generate flash cards from
 * @returns Array of { question, answer } pairs
 */
export async function generateFlashCards(title: string, content: string): Promise<Array<{ question: string, answer: string }>> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
    }
    
    // Initialize the Generative AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // For text-only input, use the gemini-1.0-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];
    
    // Format the prompt for best flash card generation
    const prompt = `
      Create comprehensive flash cards from the following content titled "${title}".
      
      Create at least 5 and at most 10 flash cards based on the most important concepts.
      Each flash card should have a clear question and a concise answer.
      Focus on key concepts, definitions, and important facts.
      Ensure the cards cover the main topics from all sections.
      Return the results as JSON in the following format:
      [
        {
          "question": "Question 1?",
          "answer": "Answer 1"
        },
        {
          "question": "Question 2?",
          "answer": "Answer 2"
        }
      ]
      
      Here's the content:
      ${content}
    `;

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings,
    });

    const response = result.response;
    const generatedText = response.text();
    
    // Extract the JSON from the text (it might be wrapped in markdown code blocks)
    const jsonMatch = generatedText.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from the Gemini response");
    }

    const flashCards = JSON.parse(jsonMatch[0]);
    return flashCards;

  } catch (error) {
    console.error("Error generating flash cards:", error);
    throw error;
  }
}
