import { supabase } from "./supabase"
import type { PressRelease, WeatherData, EarlyWarning, InterviewRequest, InterviewRecording } from "./supabase"

const isMock = !supabase

/* ----------  Mock placeholder data for preview ---------- */
const mockPressReleases = [
  {
    id: "1",
    title: "Konferensi Pers Menteri Lingkungan Hidup",
    excerpt: "Pembahasan kebijakan baru tentang pengelolaan sampah plastik di Indonesia.",
    category: "Lingkungan",
    published_date: "2024-01-15",
  },
  {
    id: "2",
    title: "Peluncuran Program Digitalisasi UMKM",
    excerpt: "Pemerintah meluncurkan program bantuan digitalisasi untuk UMKM se-Indonesia.",
    category: "Ekonomi",
    published_date: "2024-01-14",
  },
  {
    id: "3",
    title: "Update Situasi Cuaca Ekstrem",
    excerpt: "BMKG memberikan update terkini mengenai kondisi cuaca ekstrem di beberapa wilayah.",
    category: "Cuaca",
    published_date: "2024-01-13",
  },
] satisfies PressRelease[]

const today = new Date().toISOString().split("T")[0]

const mockWeather: WeatherData[] = [
  {
    id: "wx",
    location: "Jakarta",
    temperature: 28,
    condition: "Cerah berawan",
    humidity: 65,
    wind_speed: 12,
    pressure: 1013,
    forecast_date: today,
    created_at: today,
  },
]

const mockWarnings: EarlyWarning[] = [
  {
    id: "w1",
    title: "Peringatan Cuaca Ekstrem",
    description: "Potensi hujan lebat di wilayah Jabodetabek",
    warning_level: "Sedang",
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: today,
    updated_at: today,
  },
]
/* -------------------------------------------------------- */

// Auth functions
export async function authenticateUser(username: string, password: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("username", username).single()

    if (error || !data) {
      return { success: false, error: "User not found" }
    }

    // In a real app, you'd hash and compare passwords properly
    // For demo purposes, we'll use simple comparison
    const isValidPassword =
      (password === "admin123" && username === "admin") || (password === "user123" && username === "user")

    if (!isValidPassword) {
      return { success: false, error: "Invalid password" }
    }

    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: "Authentication failed" }
  }
}

// Press Release functions
export async function getPressReleases(): Promise<PressRelease[]> {
  if (isMock) return mockPressReleases
  const { data, error } = await supabase
    .from("press_releases")
    .select("*")
    .order("published_date", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching press releases:", error)
    return []
  }

  return data || []
}

export async function createPressRelease(pressRelease: Omit<PressRelease, "id" | "created_at" | "updated_at">) {
  if (isMock) return { ...pressRelease, id: "mock", created_at: today, updated_at: today } as any
  const { data, error } = await supabase.from("press_releases").insert([pressRelease]).select().single()

  if (error) {
    throw new Error(`Failed to create press release: ${error.message}`)
  }

  return data
}

// Weather functions
export async function getWeatherData(): Promise<WeatherData[]> {
  if (isMock) return mockWeather
  const { data, error } = await supabase
    .from("weather_data")
    .select("*")
    .eq("forecast_date", new Date().toISOString().split("T")[0])
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching weather data:", error)
    return []
  }

  return data || []
}

export async function updateWeatherData(location: string, weatherData: Partial<WeatherData>) {
  if (isMock) return { location, ...weatherData, id: "mock", created_at: today, updated_at: today } as any
  const { data, error } = await supabase
    .from("weather_data")
    .upsert([{ location, ...weatherData, forecast_date: new Date().toISOString().split("T")[0] }])
    .select()

  if (error) {
    throw new Error(`Failed to update weather data: ${error.message}`)
  }

  return data
}

// Early Warning functions
export async function getEarlyWarnings(): Promise<EarlyWarning[]> {
  if (isMock) return mockWarnings
  const { data, error } = await supabase
    .from("early_warnings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching early warnings:", error)
    return []
  }

  return data || []
}

// Interview Request functions
export async function getInterviewRequests(): Promise<InterviewRequest[]> {
  if (isMock) return []
  const { data, error } = await supabase
    .from("interview_requests")
    .select("*")
    .order("interview_datetime", { ascending: false })

  if (error) {
    console.error("Error fetching interview requests:", error)
    return []
  }

  return data || []
}

export async function createInterviewRequest(
  request: Omit<InterviewRequest, "id" | "created_at" | "updated_at" | "status">,
) {
  if (isMock) return { ...request, id: "mock", created_at: today, updated_at: today, status: "pending" } as any
  const { data, error } = await supabase
    .from("interview_requests")
    .insert([{ ...request, status: "pending" }])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create interview request: ${error.message}`)
  }

  return data
}

export async function updateInterviewRequestStatus(id: string, status: InterviewRequest["status"], notes?: string) {
  if (isMock) return { id, status, notes, created_at: today, updated_at: today } as any
  const { data, error } = await supabase
    .from("interview_requests")
    .update({ status, notes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update interview request: ${error.message}`)
  }

  return data
}

// Interview Recording functions
export async function getInterviewRecordings(): Promise<InterviewRecording[]> {
  const { data, error } = await supabase
    .from("interview_recordings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching interview recordings:", error)
    return []
  }

  return data || []
}

export async function createInterviewRecording(
  recording: Omit<InterviewRecording, "id" | "created_at" | "updated_at">,
) {
  if (isMock) return { ...recording, id: "mock", created_at: today, updated_at: today } as any
  const { data, error } = await supabase.from("interview_recordings").insert([recording]).select().single()

  if (error) {
    throw new Error(`Failed to create interview recording: ${error.message}`)
  }

  return data
}

export async function updateInterviewRecording(id: string, updates: Partial<InterviewRecording>) {
  if (isMock) return { id, ...updates, created_at: today, updated_at: today } as any
  const { data, error } = await supabase
    .from("interview_recordings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update interview recording: ${error.message}`)
  }

  return data
}

// Statistics functions
export async function getDashboardStats() {
  if (isMock)
    return {
      totalInterviews: 0,
      completedInterviews: 0,
      pendingInterviews: 0,
      totalRecordings: 0,
      totalPressReleases: 0,
    }
  try {
    const [interviewRequests, recordings, pressReleases] = await Promise.all([
      supabase.from("interview_requests").select("status"),
      supabase.from("interview_recordings").select("id"),
      supabase.from("press_releases").select("id"),
    ])

    const totalInterviews = interviewRequests.data?.length || 0
    const completedInterviews = interviewRequests.data?.filter((req) => req.status === "completed").length || 0
    const pendingInterviews = interviewRequests.data?.filter((req) => req.status === "pending").length || 0
    const totalRecordings = recordings.data?.length || 0
    const totalPressReleases = pressReleases.data?.length || 0

    return {
      totalInterviews,
      completedInterviews,
      pendingInterviews,
      totalRecordings,
      totalPressReleases,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalInterviews: 0,
      completedInterviews: 0,
      pendingInterviews: 0,
      totalRecordings: 0,
      totalPressReleases: 0,
    }
  }
}
