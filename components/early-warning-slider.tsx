"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEarlyWarnings } from "@/lib/database"
import type { EarlyWarning } from "@/lib/supabase"

export default function EarlyWarningSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [warnings, setWarnings] = useState<EarlyWarning[]>([])

  useEffect(() => {
    const fetchWarnings = async () => {
      const data = await getEarlyWarnings()
      setWarnings(data)
    }
    fetchWarnings()
  }, [])

  useEffect(() => {
    if (warnings.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % warnings.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [warnings.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % warnings.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + warnings.length) % warnings.length)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Tinggi":
        return "bg-red-100 text-red-800"
      case "Sedang":
        return "bg-yellow-100 text-yellow-800"
      case "Rendah":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (warnings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Tidak ada peringatan dini saat ini</div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {warnings.map((warning) => (
            <div key={warning.id} className="w-full flex-shrink-0">
              <img
                src={warning.image_url || "/placeholder.svg?height=200&width=300"}
                alt={warning.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{warning.title}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(warning.warning_level)}`}
                  >
                    {warning.warning_level}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{warning.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" size="sm" onClick={prevSlide}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex space-x-2">
          {warnings.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={nextSlide}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
