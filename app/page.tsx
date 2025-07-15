import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Newspaper } from "lucide-react"
import WeatherWidget from "@/components/weather-widget"
import EarlyWarningSlider from "@/components/early-warning-slider"
import Link from "next/link"
import { getPressReleases } from "@/lib/database"

export default async function HomePage() {
  const pressReleases = await getPressReleases()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MW</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Media Wawancara</h1>
            </div>
            <nav className="flex space-x-6">
              <Link href="/" className="text-blue-600 font-medium">
                Beranda
              </Link>
              <Link href="/interview-request" className="text-gray-600 hover:text-gray-900">
                Permohonan Wawancara
              </Link>
              <Link href="/historical-data" className="text-gray-600 hover:text-gray-900">
                Data Historis
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Press Releases */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Newspaper className="w-5 h-5" />
                  <span>Press Release Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pressReleases.map((release) => (
                  <div key={release.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{release.category}</Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(release.published_date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{release.title}</h3>
                    <p className="text-gray-600 text-sm">{release.excerpt}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Lihat Semua Press Release
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Weather & Warnings */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Early Warning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>Peringatan Dini</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EarlyWarningSlider />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Layanan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="font-semibold mb-2">Wawancara Telepon</h3>
                <p className="text-gray-600 text-sm">Lakukan wawancara melalui telepon dengan mudah</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold mb-2">Chat WhatsApp</h3>
                <p className="text-gray-600 text-sm">Wawancara melalui chat WhatsApp yang praktis</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <h3 className="font-semibold mb-2">Virtual Meeting</h3>
                <p className="text-gray-600 text-sm">Wawancara virtual dengan kualitas HD</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
