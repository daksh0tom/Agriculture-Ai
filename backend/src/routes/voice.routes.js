import express from "express"
import { voiceChat, getAvailableVoices } from "../controllers/voice.controller.js"

const router = express.Router()

router.post("/chat", voiceChat)
router.get("/voices", getAvailableVoices)

export default router
