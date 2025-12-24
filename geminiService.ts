import { GoogleGenAI } from "@google/genai";

export async function getHumbleEncouragement(): Promise<string> {
  // 仅在函数调用时获取 API KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("未检测到 API_KEY，小的这就去给大人准备茶水，咱们不跟 API 计较。");
    return "大人，这17块钱也是钱，咱们不跟钱过不去！";
  }

  try {
    // 每次请求时动态实例化，确保环境安全
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "给一个正在公司辛苦工作（摸鱼）的职场人写一句极度卑微、讨好、耐心的鼓励话语。要求：用‘小的’自称，称呼对方为‘大人’。语气要像极度忠诚的奴才，字数控制在30字以内。",
    });
    
    // 直接返回提取的文本
    return response.text?.trim() || "大人，您辛苦了，小的为您祈福。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "大人，小的即便肝脑涂地，也愿为您排忧解难。";
  }
}