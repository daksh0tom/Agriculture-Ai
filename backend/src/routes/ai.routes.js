import express from "express"
import { getCropAdvice, analyzeCrop } from "../controllers/ai.controller.js"

const router = express.Router()

router.post("/crop-advice", getCropAdvice)
router.post("/analyze-crop", analyzeCrop)

export default router
