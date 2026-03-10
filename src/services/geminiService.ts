import { GoogleGenAI } from "@google/genai";
import { Recommendation, NewsItem } from "../types";

// Lazy initialization to prevent crash if key is missing
let genAIInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAIInstance) {
    // Hardcoded key provided by user for immediate fix on mobile
    // WARNING: This key is now visible to anyone who inspects the app.
    const apiKey = "AIzaSyCjAjfD1PZYek3GepOzOaRjGCW5uPuQ4Xo";
    genAIInstance = new GoogleGenAI({ apiKey });
  }
  return genAIInstance;
};

export const getRecommendations = async (input: string): Promise<Recommendation[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Recommend 5 manga or manhwa titles based on these tropes or favorites: ${input}. 
      Return ONLY a JSON array of objects with "title" and "synopsis" (concise, 2-3 sentences) fields. 
      Do not include markdown formatting or extra text.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI returned an empty response.");
    
    return JSON.parse(text);
  } catch (e: any) {
    console.error("Recommendation Error:", e);
    const message = e.message || "Unknown connection error";
    throw new Error(message);
  }
};

export const searchNews = async (query: string): Promise<NewsItem[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest chapter releases or news about the manga/manhwa series: ${query}. 
      Provide a list of recent updates. Return ONLY a JSON array of objects with "title", "snippet", and "link" fields.
      Do not include markdown formatting or extra text.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI returned an empty response.");

    return JSON.parse(text);
  } catch (e: any) {
    console.error("News Search Error:", e);
    const message = e.message || "Unknown connection error";
    throw new Error(message);
  }
};
