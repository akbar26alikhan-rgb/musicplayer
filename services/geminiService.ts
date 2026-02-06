
import { GoogleGenAI, Type } from "@google/genai";
import { AISuggestion, Song } from "../types";

// Initialize the Gemini API client using the environment variable directly as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMusicInsights = async (currentSong: Song): Promise<AISuggestion> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Current song: "${currentSong.title}" by ${currentSong.artist}. 
                 Analyze the mood and suggest a listening path for an Android user.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reason: { type: Type.STRING, description: "Why this song fits the mood" },
            mood: { type: Type.STRING, description: "The core emotion of the track" },
            suggestedGenre: { type: Type.STRING, description: "Next genre to explore" }
          },
          required: ["reason", "mood", "suggestedGenre"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      reason: "Could not fetch AI insights at this time.",
      mood: "Unknown",
      suggestedGenre: "Any"
    };
  }
};
