"use client"

import { useState, useCallback } from "react"
import { Camera, Upload, Leaf, AlertTriangle, Shield, Pill, Search, Sparkles, MessageSquare } from "lucide-react"
import { analyzeCropImage } from "../services/api"

export default function CropHealthAnalyzer() {
  const [image, setImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [report, setReport] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [cropType, setCropType] = useState("")
  const [customQuery, setCustomQuery] = useState("") // NEW: Custom question field

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processImage(file)
    }
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const processImage = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!cropType) {
      setError("Please enter the crop type")
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      // Create a detailed description based on user input
      const imageDescription = customQuery 
        ? `A ${cropType} plant. The farmer asks: "${customQuery}"`
        : `A ${cropType} plant showing visible symptoms that need diagnosis`
      
      const response = await analyzeCropImage(imageDescription, cropType, customQuery || null)
      
      if (response.success) {
        setReport(response.analysis)
      } else {
        throw new Error(response.error || "Analysis failed")
      }
    } catch (err) {
      setError(err.message || "Failed to analyze crop. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low":
      case "healthy":
        return "bg-[var(--color-success)]/10 text-[var(--color-success)]"
      case "medium":
        return "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
      case "high":
      case "severe":
        return "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const resetAnalyzer = () => {
    setImage(null)
    setReport(null)
    setCropType("")
    setCustomQuery("")
    setError(null)
  }

  return (
    <div className="bg-[var(--color-background-card)] rounded-3xl shadow-lg p-6 border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-2xl flex items-center justify-center">
          <Camera className="w-6 h-6 text-[var(--color-secondary)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">Crop Health Analyzer</h2>
          <p className="text-[var(--color-foreground-muted)] text-sm">Upload photo and ask specific questions</p>
        </div>
      </div>

      {!report ? (
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            {image ? (
              <div className="space-y-4">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Uploaded crop"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={resetAnalyzer}
                  className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-danger)]"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-[var(--color-foreground-subtle)] mx-auto mb-4" />
                <p className="text-[var(--color-foreground)] font-medium mb-2">Drag & drop your crop photo</p>
                <p className="text-[var(--color-foreground-muted)] text-sm mb-4">or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          {/* Crop Type Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
              <Leaf className="w-4 h-4 inline mr-1" />
              Crop Type *
            </label>
            <input
              type="text"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="e.g., Tomato, Rice, Wheat, Cotton"
              className="w-full px-4 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)]"
            />
          </div>

          {/* Custom Query Input - NEW */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Ask Specific Question (Optional)
            </label>
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g., Why are the leaves turning yellow? Is this a pest problem? What nutrients are missing?"
              rows="3"
              className="w-full px-4 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)] resize-none"
            />
            <p className="text-xs text-[var(--color-foreground-muted)] mt-2">
              💡 Ask specific questions for detailed, personalized advice
            </p>
          </div>

          {/* Example Questions */}
          <div className="bg-[var(--color-background-soft)] rounded-xl p-4">
            <p className="text-xs font-semibold text-[var(--color-foreground)] mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Example Questions:
            </p>
            <div className="space-y-1">
              {[
                "What disease is affecting my crop?",
                "How can I treat these spots on leaves?",
                "Is this pest damage or nutrient deficiency?",
                "What immediate action should I take?"
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomQuery(example)}
                  className="block w-full text-left text-xs text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors py-1"
                >
                  • {example}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          {image && (
            <button
              onClick={analyzeImage}
              disabled={analyzing || !cropType}
              className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Analyze Crop
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        /* Report Display */
        <div className="space-y-4">
          {/* Header with Image Thumbnail */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {image && (
                <img
                  src={image}
                  alt="Analyzed crop"
                  className="w-16 h-16 object-cover rounded-lg border-2 border-[var(--color-border)]"
                />
              )}
              <div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)]">AI Analysis Report</h3>
                <p className="text-xs text-[var(--color-foreground-muted)]">Generated just for you</p>
              </div>
            </div>
            <button onClick={resetAnalyzer} className="text-sm text-[var(--color-primary)] hover:underline font-medium">
              New Analysis
            </button>
          </div>

          <div className="space-y-3">
            {/* Crop Name */}
            <div className="flex items-center gap-3 p-3 bg-[var(--color-background-soft)] rounded-xl">
              <Leaf className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs text-[var(--color-foreground-muted)]">Crop Identified</p>
                <p className="font-semibold text-[var(--color-foreground)]">{report.cropName}</p>
              </div>
            </div>

            {/* Disease/Health Status */}
            <div className="flex items-center gap-3 p-3 bg-[var(--color-background-soft)] rounded-xl">
              <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
              <div className="flex-1">
                <p className="text-xs text-[var(--color-foreground-muted)]">Health Status</p>
                <p className="font-semibold text-[var(--color-foreground)]">{report.diseaseName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(report.severity)}`}>
                {report.severity}
              </span>
            </div>

            {/* Personalized Message */}
            {report.personalMessage && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Personal Note for You
                </p>
                <p className="text-sm text-blue-900 leading-relaxed">{report.personalMessage}</p>
              </div>
            )}

            {/* Cause */}
            <div className="flex items-start gap-3 p-3 bg-[var(--color-background-soft)] rounded-xl">
              <Search className="w-5 h-5 text-[var(--color-accent)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--color-foreground-muted)]">What's Causing This?</p>
                <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{report.cause}</p>
              </div>
            </div>

            {/* Treatment */}
            <div className="flex items-start gap-3 p-3 bg-[var(--color-success)]/10 rounded-xl">
              <Pill className="w-5 h-5 text-[var(--color-success)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--color-success)] font-semibold">Immediate Treatment</p>
                <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{report.treatment}</p>
              </div>
            </div>

            {/* Prevention */}
            <div className="flex items-start gap-3 p-3 bg-[var(--color-accent)]/10 rounded-xl">
              <Shield className="w-5 h-5 text-[var(--color-accent)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--color-accent)] font-semibold">Prevention Tips</p>
                <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{report.prevention}</p>
              </div>
            </div>

            {/* Additional Advice */}
            {report.additionalAdvice && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-xs font-semibold text-yellow-800 mb-2">💡 Extra Tips</p>
                <p className="text-sm text-yellow-900 leading-relaxed">{report.additionalAdvice}</p>
              </div>
            )}

            {/* Confidence Score */}
            {report.confidence && (
              <div className="flex items-center justify-center gap-2 p-3 bg-[var(--color-background-soft)] rounded-xl">
                <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
                <span className="text-xs text-[var(--color-foreground-muted)]">
                  AI Confidence: {report.confidence}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
