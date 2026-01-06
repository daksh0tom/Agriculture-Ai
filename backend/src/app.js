import express from "express"
import cors from "cors"

import healthRoutes from "./routes/health.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import weatherRoutes from "./routes/weather.routes.js"
import voiceRoutes from "./routes/voice.routes.js"

const app = express()

// ✅CORS Configuration
app.use(cors({
  origin: [
    'https://agriculture-ai-rouge.vercel.app/',       // vercel dev server
               
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "🚜 AgroSense AI Backend is Running!",
    status: "online",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      ai: "/api/ai",
      weather: "/api/weather",
      voice: "/api/voice"
    }
  })
})

// API Routes
app.use("/api/health", healthRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/voice", voiceRoutes)



export default app
