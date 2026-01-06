import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Rate limiter
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 4000 // 4 seconds = 15 RPM

async function waitForRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  lastRequestTime = Date.now()
}

export const askAI = async (crop, problem, language = "English") => {
  try {
    await waitForRateLimit()
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,  // Increased for more human-like responses
        maxOutputTokens: 8192,
      }
    })

    const prompt = `
You are Raju, a wise and experienced farmer-turned-agricultural advisor with 30 years of farming experience in India. You understand the struggles farmers face and speak to them like a trusted friend and mentor.

Language: Reply ONLY in ${language} language.

Farmer's Crop: ${crop}
Farmer's Problem: ${problem}

Your response should be:
1. WARM & EMPATHETIC - Start with understanding their concern like a friend
2. SIMPLE LANGUAGE - Use everyday words, avoid technical jargon
3. PRACTICAL - Give actionable steps they can do TODAY
4. ENCOURAGING - End with hope and support

Structure your response naturally:
- Start with: "Namaste! I understand your concern about..." (in ${language})
- Explain the issue simply
- Give 2-3 immediate actions (numbered)
- Share prevention tips
- End with encouragement and timeline

Be conversational, caring, and practical. Think like a farmer helping another farmer.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
    
  } catch (error) {
    if (error.message.includes("429") || error.message.includes("quota")) {
      throw new Error("Rate limit exceeded. Please try again in a minute.")
    }
    throw error
  }
}

// Analyze crop disease with personalized, human touch
export const analyzeCropImage = async (imageDescription, cropType, customQuery = null) => {
  try {
    await waitForRateLimit()
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,  // More creative and personalized
        maxOutputTokens: 3072,
      }
    })

    const prompt = `
You are Dr. Sunita Verma, a compassionate plant pathologist who has worked with thousands of Indian farmers. You treat each farmer's crop like your own and give advice with care and expertise.

Crop Type: ${cropType}
What You See: ${imageDescription}
${customQuery ? `Farmer's Specific Question: "${customQuery}"` : ''}

Provide a detailed, personalized JSON response:
{
  "cropName": "exact crop name identified",
  "diseaseName": "disease/issue name (or 'Healthy' if no issue)",
  "severity": "Healthy/Low/Medium/High/Severe",
  "personalMessage": "A warm, personal 2-3 sentence message addressing the farmer's concern directly. Use 'you' and 'your'. Be encouraging and empathetic.",
  "cause": "Explain what's causing this in simple, everyday language. Use metaphors if helpful.",
  "treatment": "Step-by-step treatment in simple language. Be specific with quantities and timing. Start each step naturally like: 'First, you should...', 'Next, apply...', 'After 3 days, check...'",
  "prevention": "Practical prevention tips in conversational tone. Example: 'To avoid this in future, always ensure...', 'Remember to check weekly...'",
  "additionalAdvice": "${customQuery ? 'Directly answer their specific question with practical advice' : 'One golden tip based on the crop and season'}",
  "confidence": 85-99 (your confidence level as a number)
}

Important Guidelines:
- Be WARM and PERSONAL - imagine the farmer is standing right in front of you
- Use SIMPLE language - avoid scientific terms, use farmer-friendly words
- Be SPECIFIC - mention exact products, timings, quantities
- Be ENCOURAGING - give hope, don't just state problems
- If they asked a specific question, prioritize answering that
- Think about their investment, weather, season, and practical constraints

Make them feel cared for and supported!
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error("Failed to parse AI response")
    
  } catch (error) {
    console.error("AI Analysis Error:", error)
    throw error
  }
}
