import { GoogleGenAI } from "@google/genai";

export async function getHumbleEncouragement(): Promise<string> {
  // 仅在函数调用时动态获取 API KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("未检测到 API_KEY，请确保环境变量已配置。");
    return "大人，这17块钱也是钱，咱们不跟钱过不去！";
  }

  try {
    // 每次请求时创建实例，确保使用最新的环境配置
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "给一个正在公司辛苦工作（摸鱼）的职场人写一句极度卑微、讨好、耐心的鼓励话语。要求：用‘小的’自称，称呼对方为‘大人’。语气要像极度忠诚的奴才，字数控制在30字以内。",
    });
    
    // 使用 .text 属性获取结果
    return response.text?.trim() || "大人，您辛苦了，小的为您祈福。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "大人，小的即便肝脑涂地，也愿为您排忧解难。";
  }
}