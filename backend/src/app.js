import express from "express"
import cors from "cors"

import healthRoutes from "./routes/health.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import weatherRoutes from "./routes/weather.routes.js"
import voiceRoutes from "./routes/voice.routes.js"  // NEW

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/health", healthRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/voice", voiceRoutes)  // NEW

export default app
