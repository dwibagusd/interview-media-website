"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Phone, MessageCircle, Users, Video, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createInterviewRequest } from "@/lib/database"

export default function InterviewRequestPage() {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    interviewerName: "",
    mediaName: "",
    topic: "",
    datetime: "",
    virtualLink: "",
  })

  const interviewMethods = [
    { id: "phone", label: "Via Telepon", icon: Phone, description: "Wawancara melalui panggilan telepon" },
    { id: "whatsapp", label: "Chat WhatsApp", icon: MessageCircle, description: "Wawancara melalui chat WhatsApp" },
    { id: "inperson", label: "Secara Langsung", icon: Users, description: "Wawancara tatap muka langsung" },
    { id: "virtual", label: "Virtual Meeting", icon: Video, description: "Wawancara melalui video conference" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createInterviewRequest({
        interviewer_name: formData.interviewerName,
        media_name: formData.mediaName,
        topic: formData.topic,
        interview_method: selectedMethod as any,
        interview_datetime: formData.datetime,
        virtual_link: selectedMethod === "virtual" ? formData.virtualLink : undefined,
      })

      alert("Permohonan wawancara berhasil dikirim!")

      // Reset form
      setFormData({
        interviewerName: "",
        mediaName: "",
        topic: "",
        datetime: "",
        virtualLink: "",
      })
      setSelectedMethod("")
    } catch (error) {
      console.error("Error submitting interview request:", error)
      alert("Terjadi kesalahan saat mengirim permohonan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Permohonan Wawancara</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Form Permohonan Wawancara</CardTitle>
            <p className="text-gray-600">Silakan lengkapi form berikut untuk mengajukan permohonan wawancara</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Interview Method Selection */}
              <div>
                <Label className="text-base font-medium mb-4 block">Pilih Metode Wawancara</Label>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interviewMethods.map((method) => (
                      <div key={method.id} className="relative">
                        <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors"
                        >
                          <method.icon className="w-6 h-6 text-gray-600 peer-checked:text-blue-600" />
                          <div>
                            <div className="font-medium">{method.label}</div>
                            <div className="text-sm text-gray-500">{method.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="interviewerName">Nama Pewawancara *</Label>
                  <Input
                    id="interviewerName"
                    value={formData.interviewerName}
                    onChange={(e) => handleInputChange("interviewerName", e.target.value)}
                    placeholder="Masukkan nama pewawancara"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mediaName">Nama Media *</Label>
                  <Input
                    id="mediaName"
                    value={formData.mediaName}
                    onChange={(e) => handleInputChange("mediaName", e.target.value)}
                    placeholder="Masukkan nama media"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="topic">Topik Wawancara *</Label>
                <Textarea
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleInputChange("topic", e.target.value)}
                  placeholder="Jelaskan topik yang akan dibahas dalam wawancara"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="datetime">Waktu Wawancara *</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => handleInputChange("datetime", e.target.value)}
                  required
                />
              </div>

              {/* Virtual Meeting Link (only show if virtual method is selected) */}
              {selectedMethod === "virtual" && (
                <div>
                  <Label htmlFor="virtualLink">Link Virtual Meeting</Label>
                  <Input
                    id="virtualLink"
                    value={formData.virtualLink}
                    onChange={(e) => handleInputChange("virtualLink", e.target.value)}
                    placeholder="https://zoom.us/j/... atau link meeting lainnya"
                  />
                  <p className="text-sm text-gray-500 mt-1">Kosongkan jika ingin kami yang menyediakan link meeting</p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      interviewerName: "",
                      mediaName: "",
                      topic: "",
                      datetime: "",
                      virtualLink: "",
                    })
                    setSelectedMethod("")
                  }}
                >
                  Reset Form
                </Button>
                <Button type="submit" disabled={!selectedMethod || isSubmitting}>
                  {isSubmitting ? "Mengirim..." : "Kirim Permohonan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
