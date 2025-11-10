
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: This key is managed by the environment and should not be hardcoded.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generatePostIdea = async (): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not configured for Gemini.");
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Give me a short, engaging social media post idea. Be creative and concise, like something you would see on a popular social feed. Do not include hashtags.'
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received an empty response from Gemini API.");
    }
    // Clean up potential markdown or quotes
    return text.trim().replace(/^"|"$/g, '');
  } catch (error) {
    console.error("Error generating post idea from Gemini:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
