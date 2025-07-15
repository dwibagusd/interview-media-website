import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain } from "lucide-react"
import { getWeatherData } from "@/lib/database"

export default async function WeatherWidget() {
  const weatherData = await getWeatherData()
  const currentWeather = weatherData[0] || {
    location: "Jakarta",
    temperature: 28,
    condition: "Cerah berawan",
    humidity: 65,
    wind_speed: 12,
    pressure: 1013,
  }

  const getWeatherIcon = (condition: string) => {
    if (condition?.toLowerCase().includes("hujan")) return CloudRain
    if (condition?.toLowerCase().includes("cerah")) return Sun
    return Cloud
  }

  const WeatherIcon = getWeatherIcon(currentWeather.condition || "")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-blue-500" />
          <span>Prakiraan Cuaca Harian</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{currentWeather.location}</span>
              <WeatherIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{currentWeather.temperature}°C</div>
            <div className="text-sm text-gray-600">{currentWeather.condition}</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Kelembaban</span>
              <span className="font-medium">{currentWeather.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span>Angin</span>
              <span className="font-medium">{currentWeather.wind_speed} km/h</span>
            </div>
            <div className="flex justify-between">
              <span>Tekanan</span>
              <span className="font-medium">{currentWeather.pressure} hPa</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Prakiraan 3 Hari</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">Besok</div>
                <Sun className="w-4 h-4 mx-auto my-1 text-yellow-500" />
                <div>30°/22°</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Lusa</div>
                <CloudRain className="w-4 h-4 mx-auto my-1 text-blue-500" />
                <div>26°/20°</div>
              </div>
              <div className="text-center">
                <div className="font-medium">3 Hari</div>
                <Cloud className="w-4 h-4 mx-auto my-1 text-gray-500" />
                <div>28°/21°</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
