
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getHumbleEncouragement(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "给一个正在公司辛苦工作（摸鱼）的职场人写一句极度卑微、讨好、耐心的鼓励话语。要求：用‘小的’自称，称呼对方为‘大人’。语气要像极度忠诚的奴才，字数控制在30字以内。",
    });
    return response.text?.trim() || "大人，您辛苦了，小的为您祈福。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "大人，这17块钱也是钱，咱们不跟钱过不去！";
  }
}
