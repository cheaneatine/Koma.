import { GoogleGenAI } from "@google/genai";
import { Recommendation, NewsItem } from "../types";

// Lazy initialization to prevent crash if key is missing
let genAIInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      console.error("GEMINI_API_KEY is missing from environment");
    }
    genAIInstance = new GoogleGenAI({ apiKey: apiKey || '' });
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
    let message = "Unknown connection error";
    
    try {
      if (e.message && e.message.includes('{')) {
        const jsonError = JSON.parse(e.message.substring(e.message.indexOf('{')));
        if (jsonError.error?.message) {
          message = jsonError.error.message;
        }
      } else {
        message = e.message || message;
      }
    } catch (parseErr) {
      message = e.message || message;
    }

    if (message.includes("quota") || message.includes("429")) {
      throw new Error("You've reached the AI's daily limit. Please try again in a few minutes.");
    }
    if (message.includes("leaked") || message.includes("API_KEY_INVALID")) {
      throw new Error("Your API key was disabled for security. Please generate a NEW key at aistudio.google.com and add it to the app settings.");
    }
    throw new Error(message);
  }
};

const CACHE_KEY = 'koma_news_cache';
const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours

interface CacheEntry {
  timestamp: number;
  data: NewsItem[];
}

export const searchNews = async (query: string): Promise<NewsItem[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  
  // Check cache first
  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (cacheRaw) {
      const cache: Record<string, CacheEntry> = JSON.parse(cacheRaw);
      const entry = cache[normalizedQuery];
      if (entry && Date.now() - entry.timestamp < CACHE_EXPIRY) {
        console.log("Returning cached news for:", normalizedQuery);
        return entry.data;
      }
    }
  } catch (e) {
    console.error("Cache read error:", e);
  }

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

    const results = JSON.parse(text);

    // Save to cache
    try {
      const cacheRaw = localStorage.getItem(CACHE_KEY);
      const cache: Record<string, CacheEntry> = cacheRaw ? JSON.parse(cacheRaw) : {};
      cache[normalizedQuery] = {
        timestamp: Date.now(),
        data: results
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.error("Cache write error:", e);
    }

    return results;
  } catch (e: any) {
    console.error("News Search Error:", e);
    let message = "Unknown connection error";
    
    try {
      if (e.message && e.message.includes('{')) {
        const jsonError = JSON.parse(e.message.substring(e.message.indexOf('{')));
        if (jsonError.error?.message) {
          message = jsonError.error.message;
        }
      } else {
        message = e.message || message;
      }
    } catch (parseErr) {
      message = e.message || message;
    }

    if (message.includes("quota") || message.includes("429")) {
      throw new Error("You've reached the AI's daily limit. Please try again in a few minutes.");
    }
    if (message.includes("leaked") || message.includes("API_KEY_INVALID")) {
      throw new Error("Your API key was disabled for security. Please generate a NEW key at aistudio.google.com and add it to the app settings.");
    }
    throw new Error(message);
  }
};
