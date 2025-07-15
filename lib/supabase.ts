import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// In production you **must** set these as env vars.
// For local/preview you can hard-code temporary values if needed.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// OPTIONAL – uncomment the next two lines to use hard-coded values
// while previewing without env vars (DON’T ship these to prod).
// const supabaseUrl = "https://YOUR-PROJECT.supabase.co"
// const supabaseAnonKey = "YOUR_PUBLIC_ANON_KEY"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

if (url && anon) {
  supabase = createClient(url, anon)
} else {
  // We’re in preview / no env vars – work offline with stubs.
  console.warn("[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing – using mock client.")
}

/**
 * Helper that returns the real client in production or `null` in preview.
 */
export { supabase }

// Database types
export interface User {
  id: string
  username: string
  user_type: "user" | "admin"
  full_name?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface PressRelease {
  id: string
  title: string
  excerpt?: string
  content?: string
  category?: string
  published_date: string
  created_at: string
  updated_at: string
}

export interface WeatherData {
  id: string
  location: string
  temperature?: number
  condition?: string
  humidity?: number
  wind_speed?: number
  pressure?: number
  forecast_date: string
  created_at: string
}

export interface EarlyWarning {
  id: string
  title: string
  description?: string
  warning_level: "Rendah" | "Sedang" | "Tinggi"
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InterviewRequest {
  id: string
  interviewer_name: string
  media_name: string
  topic: string
  interview_method: "phone" | "whatsapp" | "inperson" | "virtual"
  interview_datetime: string
  virtual_link?: string
  status: "pending" | "approved" | "completed" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
}

export interface InterviewRecording {
  id: string
  interview_request_id?: string
  token?: string
  interviewee_name: string
  recording_duration?: number
  transcription?: string
  audio_file_url?: string
  pdf_file_url?: string
  recorded_by?: string
  created_at: string
  updated_at: string
}
