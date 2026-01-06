"use client"

import { TrendingUp, TrendingDown, MapPin, IndianRupee, Lightbulb } from "lucide-react"

export default function MarketStrategy() {
  const marketData = {
    mandiName: "APMC Yeshwanthpur",
    distance: "12 km",
    crops: [
      { name: "Tomato", price: 45, change: 8, trend: "up" },
      { name: "Onion", price: 32, change: -3, trend: "down" },
      { name: "Potato", price: 28, change: 2, trend: "up" },
    ],
    aiRecommendation:
      "Tomato prices expected to rise 15% in next 3 days. Consider holding your harvest for better returns.",
  }

  return (
    <div className="bg-[var(--color-background-card)] rounded-3xl shadow-lg p-6 border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">Market Strategy</h2>
          <p className="text-[var(--color-foreground-muted)] text-sm">Live mandi prices</p>
        </div>
      </div>

      {/* Nearest Mandi */}
      <div className="flex items-center justify-between p-4 bg-[var(--color-background-soft)] rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">{marketData.mandiName}</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">Nearest Mandi</p>
          </div>
        </div>
        <span className="text-sm text-[var(--color-foreground-muted)]">{marketData.distance}</span>
      </div>

      {/* Crop Prices */}
      <div className="space-y-3 mb-6">
        {marketData.crops.map((crop, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-[var(--color-background-soft)] rounded-xl"
          >
            <span className="font-medium text-[var(--color-foreground)]">{crop.name}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <IndianRupee className="w-4 h-4 text-[var(--color-foreground)]" />
                <span className="font-bold text-[var(--color-foreground)]">{crop.price}/kg</span>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  crop.trend === "up"
                    ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                    : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                }`}
              >
                {crop.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(crop.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendation */}
      <div className="bg-[var(--color-primary)]/10 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)] mb-1">AI Strategy</p>
            <p className="text-sm text-[var(--color-foreground)]">{marketData.aiRecommendation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
