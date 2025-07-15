"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authenticateUser } from "@/lib/database"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await authenticateUser(credentials.username, credentials.password)

      if (result.success && result.user) {
        localStorage.setItem("userType", result.user.user_type)
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userId", result.user.id)
        localStorage.setItem("userName", result.user.full_name || result.user.username)

        if (result.user.user_type === "admin") {
          router.push("/admin-dashboard")
        } else {
          router.push("/")
        }
      } else {
        setError(result.error || "Login gagal")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Masuk ke Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Masukkan username"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Masukkan password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-4">Demo Credentials:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">User Biasa</div>
                    <div className="text-gray-600">Username: user | Password: user123</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                  <Shield className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-gray-600">Username: admin | Password: admin123</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
