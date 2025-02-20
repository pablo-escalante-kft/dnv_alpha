import OpenAI from "openai";
import { InsertStartup } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeStartup(startupData: InsertStartup) {
  const prompt = `Analyze this startup data and provide a detailed assessment with scores and recommendations. Return the analysis in JSON format with the following structure:
  {
    "scores": {
      "marketPotential": number, // 1-10
      "teamStrength": number,
      "productInnovation": number,
      "competitiveAdvantage": number,
      "financialViability": number
    },
    "analysis": {
      "strengths": string[],
      "weaknesses": string[],
      "opportunities": string[],
      "threats": string[]
    },
    "recommendations": string[],
    "riskLevel": "low" | "medium" | "high",
    "investmentPotential": "strong" | "moderate" | "weak"
  }

  Startup Data:
  ${JSON.stringify(startupData, null, 2)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert VC analyst specializing in startup evaluation.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to get analysis from OpenAI");
  }

  return JSON.parse(content);
}