"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, FileText, Users, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getDashboardStats } from "@/lib/database"

export default function AdminDashboard() {
  const [userType, setUserType] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
    totalRecordings: 0,
    totalPressReleases: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn || storedUserType !== "admin") {
      router.push("/login")
      return
    }

    setUserType(storedUserType)

    // Fetch dashboard statistics
    const fetchStats = async () => {
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)
    }

    fetchStats()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    router.push("/")
  }

  if (!userType) {
    return <div>Loading...</div>
  }

  const dashboardStats = [
    { title: "Total Wawancara", value: stats.totalInterviews.toString(), icon: Users, color: "bg-blue-500" },
    { title: "Rekaman Aktif", value: stats.totalRecordings.toString(), icon: Mic, color: "bg-green-500" },
    { title: "Wawancara Selesai", value: stats.completedInterviews.toString(), icon: FileText, color: "bg-purple-500" },
    { title: "Pending", value: stats.pendingInterviews.toString(), icon: Calendar, color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <Badge variant="secondary">Admin</Badge>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Beranda
              </Link>
              <Link href="/recorder" className="text-gray-600 hover:text-gray-900">
                Recorder
              </Link>
              <Link href="/historical-data" className="text-gray-600 hover:text-gray-900">
                Data Historis
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/recorder">
                <Button className="w-full justify-start" size="lg">
                  <Mic className="w-5 h-5 mr-3" />
                  Mulai Rekaman Baru
                </Button>
              </Link>
              <Link href="/interview-request">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <Calendar className="w-5 h-5 mr-3" />
                  Lihat Permohonan Wawancara
                </Button>
              </Link>
              <Link href="/historical-data">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <FileText className="w-5 h-5 mr-3" />
                  Kelola Data Historis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Database berhasil terkoneksi</p>
                    <p className="text-xs text-gray-500">Sistem siap digunakan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Data historis dimuat</p>
                    <p className="text-xs text-gray-500">{stats.totalInterviews} wawancara tersimpan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stats.pendingInterviews} permohonan menunggu</p>
                    <p className="text-xs text-gray-500">Perlu ditinjau segera</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
