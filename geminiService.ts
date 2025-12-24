import { GoogleGenAI } from "@google/genai";

export async function getHumbleEncouragement(): Promise<string> {
  // 严格从环境变量获取 API KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("小的斗胆提醒：未检测到 API_KEY 环境变量，请确保在 Vercel 项目设置中已配置。");
    return "大人，这17块钱也是钱，咱们不跟钱过不去！";
  }

  try {
    // 规范：使用命名参数初始化
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "你是一个极度卑微、讨好、忠诚的职场小奴才。请对一个正在摸鱼（带薪修行）的大人说一句鼓励的话。要求：自称‘小的’，称呼对方为‘大人’。语气要卑微到土里，但又要透着关心，字数30字以内。",
    });
    
    // 规范：直接访问 .text 属性而非方法
    const text = response.text;
    return text?.trim() || "大人，您的一举一动都牵动着小的的心，请务必注意休息。";
  } catch (error) {
    console.error("Gemini 逻辑受阻，小的罪该万死:", error);
    return "大人，即便前路艰辛，小的也愿做您的垫脚石。";
  }
}