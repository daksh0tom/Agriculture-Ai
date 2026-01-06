import express from "express"
import cors from "cors"

import healthRoutes from "./routes/health.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import weatherRoutes from "./routes/weather.routes.js"
import voiceRoutes from "./routes/voice.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

// ✅ ADD ROOT ROUTE HERE (before other routes)
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

// ✅ ADD 404 HANDLER (at the end)
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    message: "The requested endpoint does not exist"
  })
})

export default app
