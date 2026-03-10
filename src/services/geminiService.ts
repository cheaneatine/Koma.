import { GoogleGenAI } from "@google/genai";
import { Recommendation, NewsItem } from "../types";

// Lazy initialization to prevent crash if key is missing
let genAIInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAIInstance) {
    // Hardcoded key provided by user for immediate fix on mobile
    // WARNING: This key is now visible to anyone who inspects the app.
    const apiKey = "AIzaSyD9iB-DrcotA9WEGcLL4nfQ7yGBOH0afYA";
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
    throw new Error(message);
  }
};
