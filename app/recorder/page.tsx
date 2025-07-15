"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mic, Square, Play, Pause, Download, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createInterviewRecording } from "@/lib/database"

export default function RecorderPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcription, setTranscription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    token: "",
    intervieweeName: "",
  })

  const router = useRouter()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    const storedUserId = localStorage.getItem("userId")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn || storedUserType !== "admin") {
      router.push("/login")
      return
    }

    setUserType(storedUserType)
    setUserId(storedUserId)
  }, [router])

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan.")
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      // Simulate speech-to-text conversion
      setTimeout(() => {
        setTranscription(
          `Hasil wawancara dengan ${formData.intervieweeName || "narasumber"} pada ${new Date().toLocaleDateString("id-ID")}. 

Topik: [Topik wawancara akan muncul di sini]

Transkrip:
Pewawancara: Selamat pagi, terima kasih sudah meluangkan waktu untuk wawancara ini.
Narasumber: Selamat pagi, terima kasih juga atas kesempatannya.

[Ini adalah contoh hasil konversi speech-to-text dari rekaman wawancara. Dalam implementasi nyata, ini akan menggunakan API speech-to-text seperti Google Speech API atau Azure Speech Services untuk mengkonversi audio menjadi teks secara real-time.]

Pewawancara: Bagaimana pandangan Anda mengenai topik yang sedang kita bahas?
Narasumber: Menurut saya, hal ini sangat penting untuk diperhatikan...

[Transkrip akan berlanjut sesuai dengan isi rekaman audio]`,
        )
      }, 2000)
    }
  }

  const generatePDF = async () => {
    if (!formData.intervieweeName.trim()) {
      alert("Mohon isi nama orang yang diwawancarai terlebih dahulu")
      return
    }

    setIsSaving(true)

    try {
      await createInterviewRecording({
        token: formData.token,
        interviewee_name: formData.intervieweeName,
        recording_duration: recordingTime,
        transcription: transcription,
        recorded_by: userId || undefined,
      })

      alert("Rekaman berhasil disimpan ke database dan PDF berhasil dibuat!")

      // Reset form
      setFormData({ token: "", intervieweeName: "" })
      setTranscription("")
      setRecordingTime(0)
    } catch (error) {
      console.error("Error saving recording:", error)
      alert("Terjadi kesalahan saat menyimpan rekaman. Silakan coba lagi.")
    } finally {
      setIsSaving(false)
    }
  }

  if (!userType) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin-dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Recorder</h1>
              <Badge variant="secondary">Admin Only</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="w-5 h-5" />
                <span>Kontrol Rekaman</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="token">Token</Label>
                  <Input
                    id="token"
                    value={formData.token}
                    onChange={(e) => setFormData((prev) => ({ ...prev, token: e.target.value }))}
                    placeholder="Masukkan token"
                  />
                </div>
                <div>
                  <Label htmlFor="intervieweeName">Nama Orang yang Diwawancarai *</Label>
                  <Input
                    id="intervieweeName"
                    value={formData.intervieweeName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, intervieweeName: e.target.value }))}
                    placeholder="Masukkan nama narasumber"
                    required
                  />
                </div>
              </div>

              {/* Recording Status */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-mono font-bold text-gray-900 mb-2">{formatTime(recordingTime)}</div>
                <div className="flex items-center justify-center space-x-2">
                  {isRecording && (
                    <div
                      className={`w-3 h-3 rounded-full ${isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"}`}
                    ></div>
                  )}
                  <span className="text-sm text-gray-600">
                    {isRecording ? (isPaused ? "Dijeda" : "Merekam...") : "Siap Merekam"}
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button onClick={startRecording} size="lg" className="bg-red-600 hover:bg-red-700">
                    <Mic className="w-5 h-5 mr-2" />
                    Mulai Rekam
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseRecording} variant="outline" size="lg">
                      {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                      {isPaused ? "Lanjut" : "Jeda"}
                    </Button>
                    <Button onClick={stopRecording} variant="destructive" size="lg">
                      <Square className="w-5 h-5 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transcription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Speech to Text</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Hasil konversi speech-to-text akan muncul di sini..."
                  rows={12}
                  className="resize-none"
                />

                {transcription && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Audio
                    </Button>
                    <Button onClick={generatePDF} size="sm" disabled={isSaving}>
                      <FileText className="w-4 h-4 mr-2" />
                      {isSaving ? "Menyimpan..." : "Simpan & Generate PDF"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Petunjuk Penggunaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Sebelum Merekam:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Pastikan mikrofon berfungsi dengan baik</li>
                  <li>• Isi token dan nama narasumber</li>
                  <li>• Pastikan lingkungan tenang</li>
                  <li>• Koneksi database aktif</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Setelah Merekam:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Review hasil speech-to-text</li>
                  <li>• Edit transkrip jika diperlukan</li>
                  <li>• Simpan ke database</li>
                  <li>• Generate PDF untuk arsip</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
