"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Eye, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getInterviewRequests } from "@/lib/database"
import type { InterviewRequest } from "@/lib/supabase"

export default function HistoricalDataPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [interviewData, setInterviewData] = useState<InterviewRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInterviewRequests()
        setInterviewData(data)
      } catch (error) {
        console.error("Error fetching interview data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData = interviewData.filter((item) => {
    const matchesSearch =
      item.interviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.media_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || item.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "virtual":
        return "bg-blue-100 text-blue-800"
      case "phone":
        return "bg-purple-100 text-purple-800"
      case "whatsapp":
        return "bg-green-100 text-green-800"
      case "inperson":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "virtual":
        return "Virtual Meeting"
      case "phone":
        return "Telepon"
      case "whatsapp":
        return "WhatsApp"
      case "inperson":
        return "Langsung"
      default:
        return method
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai"
      case "pending":
        return "Pending"
      case "cancelled":
        return "Dibatalkan"
      case "approved":
        return "Disetujui"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
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
              <h1 className="text-xl font-semibold text-gray-900">Data Historis Wawancara</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan nama, media, atau topik..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="completed">Selesai</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Disetujui</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Lanjutan
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {interviewData.filter((item) => item.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Wawancara Selesai</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {interviewData.filter((item) => item.status === "pending").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(interviewData.map((item) => item.media_name)).size}
                </div>
                <div className="text-sm text-gray-600">Media Partner</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{interviewData.length}</div>
                <div className="text-sm text-gray-600">Total Wawancara</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Wawancara</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal & Waktu</TableHead>
                    <TableHead>Pewawancara</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Topik</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {new Date(item.interview_datetime).toLocaleDateString("id-ID")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(item.interview_datetime).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.interviewer_name}</TableCell>
                      <TableCell>{item.media_name}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={item.topic}>
                          {item.topic}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getMethodColor(item.interview_method)}>
                          {getMethodLabel(item.interview_method)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">Tidak ada data yang ditemukan</div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
