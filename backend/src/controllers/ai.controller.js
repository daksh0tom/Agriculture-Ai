import { askAI, analyzeCropImage } from "../services/ai.service.js"

export const getCropAdvice = async (req, res) => {
  try {
    const { crop, problem, language = "English" } = req.body
    
    if (!crop || !problem) {
      return res.status(400).json({ 
        success: false,
        error: "Crop and problem are required" 
      })
    }
    
    const advice = await askAI(crop, problem, language)
    
    res.json({ 
      success: true,
      crop,
      problem,
      language,
      advice 
    })
    
  } catch (error) {
    console.error("Error:", error.message)
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}

export const analyzeCrop = async (req, res) => {
  try {
    const { imageDescription, cropType = "Unknown", customQuery = null } = req.body  // Added customQuery
    
    if (!imageDescription) {
      return res.status(400).json({ 
        success: false,
        error: "Image description is required" 
      })
    }
    
    const analysis = await analyzeCropImage(imageDescription, cropType, customQuery)
    
    res.json({ 
      success: true,
      analysis 
    })
    
  } catch (error) {
    console.error("Error:", error.message)
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}
