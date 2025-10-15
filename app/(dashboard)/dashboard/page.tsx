'use client'

import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  ChevronDown, 
  Thermometer, 
  Droplets, 
  Battery, 
  Fan,
  Leaf,
  Download,
  Home,
  BellRing,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { fetchDryerData, fetchDryerDataStats } from '@/lib/dryer-data'
import { DryerData } from '@/types/dryer'
import { useAuth } from '@/contexts/AuthContext'
import { useLogout } from '@/lib/hooks/useAuth'

// Sample data for charts
const temperatureData = [
  { time: 0, inlet: 65, chamber1: 68, chamber2: 70, outlet: 67 },
  { time: 2, inlet: 66, chamber1: 69, chamber2: 71, outlet: 68 },
  { time: 4, inlet: 67, chamber1: 70, chamber2: 72, outlet: 69 },
  { time: 6, inlet: 68, chamber1: 71, chamber2: 73, outlet: 70 },
  { time: 8, inlet: 69, chamber1: 72, chamber2: 74, outlet: 71 },
  { time: 10, inlet: 70, chamber1: 73, chamber2: 75, outlet: 72 },
  { time: 12, inlet: 71, chamber1: 74, chamber2: 76, outlet: 73 },
  { time: 14, inlet: 72, chamber1: 75, chamber2: 77, outlet: 74 },
  { time: 16, inlet: 73, chamber1: 76, chamber2: 78, outlet: 75 },
  { time: 18, inlet: 74, chamber1: 77, chamber2: 79, outlet: 76 },
  { time: 20, inlet: 75, chamber1: 78, chamber2: 80, outlet: 77 },
  { time: 22, inlet: 76, chamber1: 79, chamber2: 81, outlet: 78 },
  { time: 24, inlet: 77, chamber1: 80, chamber2: 82, outlet: 79 },
]

const humidityData = [
  { time: 0, inlet: 45, chamber1: 48, chamber2: 50, outlet: 47 },
  { time: 2, inlet: 46, chamber1: 49, chamber2: 51, outlet: 48 },
  { time: 4, inlet: 47, chamber1: 50, chamber2: 52, outlet: 49 },
  { time: 6, inlet: 48, chamber1: 51, chamber2: 53, outlet: 50 },
  { time: 8, inlet: 49, chamber1: 52, chamber2: 54, outlet: 51 },
  { time: 10, inlet: 50, chamber1: 53, chamber2: 55, outlet: 52 },
  { time: 12, inlet: 51, chamber1: 54, chamber2: 56, outlet: 53 },
  { time: 14, inlet: 52, chamber1: 55, chamber2: 57, outlet: 54 },
  { time: 16, inlet: 53, chamber1: 56, chamber2: 58, outlet: 55 },
  { time: 18, inlet: 54, chamber1: 57, chamber2: 59, outlet: 56 },
  { time: 20, inlet: 55, chamber1: 58, chamber2: 60, outlet: 57 },
  { time: 22, inlet: 56, chamber1: 59, chamber2: 61, outlet: 58 },
  { time: 24, inlet: 57, chamber1: 60, chamber2: 62, outlet: 59 },
]

const batteryData = [
  { time: 0, battery: 100 },
  { time: 2, battery: 98 },
  { time: 4, battery: 96 },
  { time: 6, battery: 94 },
  { time: 8, battery: 92 },
  { time: 10, battery: 90 },
  { time: 12, battery: 88 },
  { time: 14, battery: 86 },
  { time: 16, battery: 84 },
  { time: 18, battery: 82 },
  { time: 20, battery: 80 },
  { time: 22, battery: 78 },
  { time: 24, battery: 76 },
]

export default function Dashboard() {
  const { admin } = useAuth()
  const logoutMutation = useLogout()
  const [dryerData, setDryerData] = useState<DryerData[]>([])
  const [latestData, setLatestData] = useState<DryerData | null>(null)
  const [chartData, setChartData] = useState<DryerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<string>('updated_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [timeRange, setTimeRange] = useState('24h')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filter data by time range
  const filterDataByTimeRange = (data: DryerData[], range: string) => {
    const now = new Date()
    let cutoffDate: Date

    switch (range) {
      case '1h':
        cutoffDate = new Date(now.getTime() - 1 * 60 * 60 * 1000)
        break
      case '6h':
        cutoffDate = new Date(now.getTime() - 6 * 60 * 60 * 1000)
        break
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000) // Default to 24h
    }

    return data.filter(item => new Date(item.updated_at) >= cutoffDate)
  }

  // Fetch latest data for status cards and sensor cards
  useEffect(() => {
    const loadLatestData = async () => {
      try {
        const result = await fetchDryerData(1, 1, undefined, 'updated_at', 'desc')
        if (result.data && result.data.length > 0) {
          setLatestData(result.data[0])
        }
      } catch (err) {
        console.error('Error loading latest data:', err)
      }
    }

    loadLatestData()
  }, [])



  // Fetch all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      try {
        // Fetch all data (large number to get everything)
        const result = await fetchDryerData(
          1,
          10000, // Fetch a large number to get all data
          undefined,
          'updated_at',
          'desc'
        )
        
        if (result.error) {
          setError('Failed to load data')
          console.error('Supabase error:', result.error)
        } else {
          setDryerData(result.data || [])
          setTotalCount(result.data?.length || 0)
        }
      } catch (err) {
        setError('Failed to load data')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, []) // Only run once on mount

  // Update chart data based on time range (no need to fetch again, just filter existing data)
  useEffect(() => {
    const timeFilteredData = filterDataByTimeRange(dryerData, timeRange)
    setChartData(timeFilteredData)
  }, [timeRange, dryerData])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }



  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }



  // Transform data for charts
  const transformChartData = (data: DryerData[]) => {
    return data.map((item, index) => ({
      time: index,
      inlet: item.t1,
      chamber1: item.t2,
      chamber2: item.t3,
      outlet: item.t4,
      battery: item.bat_percentage,
      timestamp: new Date(item.updated_at).toLocaleTimeString()
    })).reverse() // Reverse to show oldest to newest
  }

  const transformHumidityData = (data: DryerData[]) => {
    return data.map((item, index) => ({
      time: index,
      inlet: item.h1,
      chamber1: item.h2,
      chamber2: item.h3,
      outlet: item.h4,
      timestamp: new Date(item.updated_at).toLocaleTimeString()
    })).reverse()
  }

  const transformBatteryData = (data: DryerData[]) => {
    return data.map((item, index) => ({
      time: index,
      battery: item.bat_percentage,
      timestamp: new Date(item.updated_at).toLocaleTimeString()
    })).reverse()
  }

  // Generate chart data from real data
  const realTemperatureData = transformChartData(chartData)
  const realHumidityData = transformHumidityData(chartData)
  const realBatteryData = transformBatteryData(chartData)

  const chartConfig = {
    inlet: {
      label: "Inlet",
      color: "#22c55e",
    },
    chamber1: {
      label: "drying chamber 1",
      color: "#f97316",
    },
    chamber2: {
      label: "drying chamber 2",
      color: "#3b82f6",
    },
    outlet: {
      label: "Outlet",
      color: "#ef4444",
    },
    battery: {
      label: "Battery",
      color: "#8b5cf6",
    },
  }

  const StatusCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-2">
      <span className="text-sm font-semibold text-white">{label}:</span>
      <span className="text-3xl font-bold text-gray-50">{value}</span>
    </div>
  );
  
  const SensorCard = ({ title, data, average, icon }: any) => (
    <Card className="bg-gradient-to-br from-[#A87AF0] to-[#905EE0] text-white p-3 sm:p-4 rounded-2xl shadow-lg w-full border-none">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          <div className="text-lg sm:text-2xl font-bold flex items-center gap-2">{icon} {title}</div>
          <div className="text-xs sm:text-sm text-white/70">Dryer {title.toLowerCase()}</div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xl sm:text-2xl font-bold">{average}</div>
          <div className="text-xs sm:text-sm text-white/70">average {title}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {data.map(({ label, value, id }: any) => (
          <Card key={id} className="bg-[#E1D4F7] text-[#905EE0] text-center p-2 sm:p-3">
            <div className="text-sm sm:text-lg font-semibold h-6 sm:h-9 flex items-center justify-center">{label}</div>
            <div className="text-lg sm:text-2xl font-bold">{value}</div>
            <div className="text-xs -mt-2 sm:-mt-4">{id}</div>
          </Card>
        ))}
      </div>
    </Card>
  );

  // Get time-filtered data for cards
  const timeFilteredData = filterDataByTimeRange(dryerData, timeRange)
  const latestTimeFilteredData = timeFilteredData.length > 0 ? timeFilteredData[0] : null

  // Calculate average temperature and humidity from time-filtered data
  const averageTemperature = latestTimeFilteredData && 
    latestTimeFilteredData.t1 && latestTimeFilteredData.t2 && latestTimeFilteredData.t3 && latestTimeFilteredData.t4
    ? Math.round((latestTimeFilteredData.t1 + latestTimeFilteredData.t2 + latestTimeFilteredData.t3 + latestTimeFilteredData.t4) / 4) 
    : 0
  const averageHumidity = latestTimeFilteredData && 
    latestTimeFilteredData.h1 && latestTimeFilteredData.h2 && latestTimeFilteredData.h3 && latestTimeFilteredData.h4
    ? Math.round((latestTimeFilteredData.h1 + latestTimeFilteredData.h2 + latestTimeFilteredData.h3 + latestTimeFilteredData.h4) / 4) 
    : 0

  const temperatureDataCards = [
    { label: "Inlet", value: latestTimeFilteredData?.t1 ? `${latestTimeFilteredData.t1}°C` : 'No Data', id: "T1" },
    { label: "Dryer chamber", value: latestTimeFilteredData?.t2 ? `${latestTimeFilteredData.t2}°C` : 'No Data', id: "T2" },
    { label: "Dryer chamber", value: latestTimeFilteredData?.t3 ? `${latestTimeFilteredData.t3}°C` : 'No Data', id: "T3" },
    { label: "Outlet", value: latestTimeFilteredData?.t4 ? `${latestTimeFilteredData.t4}°C` : 'No Data', id: "T4" },
  ];
  
  const humidityDataCards = [
    { label: "Inlet", value: latestTimeFilteredData?.h1 ? `${latestTimeFilteredData.h1}%` : 'No Data', id: "H1" },
    { label: "Dryer chamber", value: latestTimeFilteredData?.h2 ? `${latestTimeFilteredData.h2}%` : 'No Data', id: "H2" },
    { label: "Dryer chamber", value: latestTimeFilteredData?.h3 ? `${latestTimeFilteredData.h3}%` : 'No Data', id: "H3" },
    { label: "Outlet", value: latestTimeFilteredData?.h4 ? `${latestTimeFilteredData.h4}%` : 'No Data', id: "H4" },
  ];

  // Export functions
  const exportToCSV = (data: DryerData[], filename: string) => {
    const headers = ['ID', 'Type', 'Set Temperature', 'T1', 'T2', 'T3', 'T4', 'H1', 'H2', 'H3', 'H4', 'Battery %', 'Updated At']
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.id,
        item.type,
        item.t_set,
        item.t1,
        item.t2,
        item.t3,
        item.t4,
        item.h1,
        item.h2,
        item.h3,
        item.h4,
        item.bat_percentage,
        new Date(item.updated_at).toLocaleString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = (data: DryerData[], filename: string) => {
    // Simple PDF export using window.print() for now
    // In a real implementation, you'd use a library like jsPDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>${filename}</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Set Temperature</th>
                  <th>T1</th>
                  <th>T2</th>
                  <th>T3</th>
                  <th>T4</th>
                  <th>H1</th>
                  <th>H2</th>
                  <th>H3</th>
                  <th>H4</th>
                  <th>Battery %</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(item => `
                  <tr>
                    <td>${item.id}</td>
                    <td>${item.type}</td>
                    <td>${item.t_set}</td>
                    <td>${item.t1}</td>
                    <td>${item.t2}</td>
                    <td>${item.t3}</td>
                    <td>${item.t4}</td>
                    <td>${item.h1}</td>
                    <td>${item.h2}</td>
                    <td>${item.h3}</td>
                    <td>${item.h4}</td>
                    <td>${item.bat_percentage}</td>
                    <td>${new Date(item.updated_at).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleExport = (format: string) => {
    const filename = `dryer-data-${new Date().toISOString().split('T')[0]}`
    
    if (format === 'csv') {
      exportToCSV(filteredAndSortedData, filename)
    } else if (format === 'pdf') {
      exportToPDF(filteredAndSortedData, filename)
    }
  }

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    // Reset to first page when changing time range
    setCurrentPage(1)
  }

  // Reset filters
  const resetFilters = () => {
    setFilterType('all')
    setFilterStatus('all')
    setSearchTerm('')
    setCurrentPage(1)
  }

  // Filter and sort data based on current filters and search
  const filteredAndSortedData = dryerData
    .filter(item => {
      const matchesType = filterType === 'all' || (item.type && item.type === filterType)
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'low' && item.bat_percentage < 20) ||
        (filterStatus === 'medium' && item.bat_percentage >= 20 && item.bat_percentage < 50) ||
        (filterStatus === 'high' && item.bat_percentage >= 50)
      
      // Search functionality
      const matchesSearch = !searchTerm || 
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.t_set?.toString().includes(searchTerm) ||
        item.t1?.toString().includes(searchTerm) ||
        item.t2?.toString().includes(searchTerm) ||
        item.t3?.toString().includes(searchTerm) ||
        item.t4?.toString().includes(searchTerm) ||
        item.h1?.toString().includes(searchTerm) ||
        item.h2?.toString().includes(searchTerm) ||
        item.h3?.toString().includes(searchTerm) ||
        item.h4?.toString().includes(searchTerm) ||
        item.bat_percentage?.toString().includes(searchTerm)
      
      return matchesType && matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof DryerData]
      let bValue: any = b[sortBy as keyof DryerData]
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Calculate pagination for filtered data
  const filteredCount = filteredAndSortedData.length
  const totalPages = Math.ceil(filteredCount / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, filteredCount)
  
  // Get paginated filtered data
  const paginatedFilteredData = filteredAndSortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Get unique types for filter dropdown - filter out empty or null values
  const uniqueTypes = Array.from(new Set(dryerData.map((item: DryerData) => item.type).filter(type => type && type.trim() !== '')))

  // Format last captured time
  const lastCapturedTime = latestTimeFilteredData ? new Date(latestTimeFilteredData.updated_at).toLocaleString() : 'No data'

  return (
    <div className="min-h-screen bg-[#DFCFF7] w-full">
      <div className="container mx-auto max-w-6xl pt-24 px-4">
        
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r to-[#925FE2] from-[#d7caec] text-white px-4 py-3 shadow-lg rounded-3xl mb-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between ">
            <div className="flex items-center space-x-2">
              <Image src="/logo/logo.svg" alt="logo" className='max-md:w-22' width={150} height={10} />
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:bg-violet-600 px-3 py-2 rounded-lg transition-colors">
                <span className=' font-semibold'>Home</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:bg-violet-600 p-2 rounded-lg transition-colors">
                <BellRing className="h-5 w-5" />
              </button>
                                      <div className="flex items-center space-x-2">
           <div className="w-8 h-8 outline-white outline-2 bg-violet-400 rounded-full flex items-center justify-center">
             <span className="text-sm font-medium">
               {admin?.full_name?.charAt(0) || admin?.email?.charAt(0) || 'U'}
             </span>
           </div>
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <button className="flex items-center space-x-1 hover:bg-violet-600 px-3 py-2 rounded-lg transition-colors">
                 <ChevronDown className="h-4 w-4" />
               </button>
             </DropdownMenuTrigger>
             <DropdownMenuContent>
               <DropdownMenuItem>
                 <span className="font-medium">
                   {admin?.full_name || admin?.email || 'User'}
                 </span>
               </DropdownMenuItem>
               <DropdownMenuItem>Help</DropdownMenuItem>
               <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Logout</DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
            </div>
          </div>
        </nav>

        <div className="p-6 space-y-4 max-w-screen-xl mx-auto">
            <div className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-purple-900">Time Range:</span>
                  <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                    <SelectTrigger className="bg-purple-200 text-purple-900 hover:bg-purple-300">
                      <SelectValue placeholder="Time Range: 24 hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="6h">6 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  {timeFilteredData.length > 0 && (
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      {timeFilteredData.length} records
                    </span>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-purple-200 text-purple-900 hover:bg-purple-300">
                      Export <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <SensorCard
                  title="Temperature"
                  average={averageTemperature > 0 ? `${averageTemperature}°C` : "No Data"}
                  icon={<span>🌡️</span>}
                  data={temperatureDataCards}
                />
                <SensorCard
                  title="Relative Humidity"
                  average={averageHumidity > 0 ? `${averageHumidity}%` : "No Data"}
                  icon={<span>💧</span>}
                  data={humidityDataCards}
                />
              </div>
              <div className="space-y-4">
                                 <Card className="bg-gradient-to-tr from-[#925FE2] to-[#DFCFF7] p-6 border-none text-purple-900 font-semibold text-lg rounded-2xl shadow-md">
                   <CardContent className="space-y-3">
                   <StatusCard label="Crop Type" value={latestTimeFilteredData?.type || "No Data"} />
                   <StatusCard label="Door Status" value="Unlocked" />
                   <StatusCard label="Battery Level" value={latestTimeFilteredData?.bat_percentage ? `${latestTimeFilteredData.bat_percentage}%` : "No Data"} />
                   </CardContent>
                 </Card>
                <Card className="bg-gradient-to-bl border-none from-[#925FE2] to-[#DFCFF7] p-6 text-purple-900 font-semibold text-lg rounded-2xl shadow-md">
                  <CardContent className="space-y-3">
                    <StatusCard label="System Status" value="Low" />
                    <div className="flex flex-col items-center justify-center p-2">
                      <span className="text-sm font-semibold text-purple-900">Last Updated:</span>
                      <span className="text-sm text-purple-700">{lastCapturedTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        </div>

        {/* Dried Items Table */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#925FE2] to-[#DFCFF7] px-6 py-4">
              <h2 className="text-2xl font-bold text-purple-50">Dried</h2>
              <p className="text-purple-50 text-sm">Items dried and the details of their drying.</p>
            </div>
            
            {/* Table Controls */}
            <div className="px-6 py-4 bg-[#925FE2] border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-50">Type:</span>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32 bg-[#1a033f] text-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-50">Status:</span>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32 bg-[#1a033f] text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="low">Low Battery</SelectItem>
                      <SelectItem value="medium">Medium Battery</SelectItem>
                      <SelectItem value="high">High Battery</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* {(filterType !== 'all' || filterStatus !== 'all' || searchTerm !== '') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetFilters}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Clear Filters
                    </Button>
                  )} */}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Sort</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleSort('type')}>
                      Sort by Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('t_set')}>
                      Sort by Set Temperature {sortBy === 't_set' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('updated_at')}>
                      Sort by Date {sortBy === 'updated_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('bat_percentage')}>
                      Sort by Battery {sortBy === 'bat_percentage' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto ">
              {loading ? (
                <div className="px-6 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading data...</p>
                </div>
              ) : error ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-red-500">{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-2">
                    Retry
                  </Button>
                </div>
              ) : (
                <table className="w-full ">
                  <thead className="bg-[#925FE2]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('type')}>
                        Item {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('t_set')}>
                        Set temperature {sortBy === 't_set' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">T1</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">T2</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">T3</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">T4</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">H1</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">H2</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">H3</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">H4</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#925FE2] divide-y divide-gray-200">
                    {paginatedFilteredData.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      paginatedFilteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-[#925FE2]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-50">{item.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.t_set}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.t1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.t2}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.t3}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.t4}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.h1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.h2}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.h3}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">{item.h4}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-[#925FE2] border-t flex items-center justify-between">
              <div className="text-sm text-gray-50">
                Showing {startItem}-{endItem} of {filteredCount} results
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-50">Rows per page:</span>
                  <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <span className="sr-only">Previous</span>
                    ‹
                  </Button>
                  <span className="text-sm text-gray-700">{currentPage} / {totalPages}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <span className="sr-only">Next</span>
                    ›
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className=" px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex items-center space-x-4 bg-[#925FE2] rounded-lg px-4 py-1">
                <span className="text-sm font-medium text-gray-50">Time Range:</span>
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-28 bg-[#1a033f] text-white">
                    <SelectValue placeholder="24 hours" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="6h">6 hours</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-center space-x-4 bg-[#925FE2] rounded-lg px-4 py-1">
                <span className="text-sm font-medium text-gray-50">Export</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-20 bg-[#1a033f] text-white">
                      Export <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      <Download className="mr-2 h-4 w-4" />
                      CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">

            {/* Charts Section - Full Width Columns */}
            <div className="space-y-6">
            {/* Temperature vs Time Chart */}
            <Card className="bg-violet-400 w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Temperature vs Time</CardTitle>
              </CardHeader>
              <CardContent>
                {realTemperatureData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart data={realTemperatureData} className='w-full'>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="timestamp" stroke="#6b7280" />
                      <YAxis domain={[0, 100]} stroke="#6b7280" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="inlet" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
                      <Line type="monotone" dataKey="chamber1" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                      <Line type="monotone" dataKey="chamber2" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                      <Line type="monotone" dataKey="outlet" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No temperature data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Humidity vs Time Chart */}
            <Card className="bg-violet-400">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Humidity vs Time</CardTitle>
              </CardHeader>
              <CardContent>
                {realHumidityData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full text-white">
                    <LineChart data={realHumidityData} className='text-white'>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="timestamp" stroke="#6b7280" />
                      <YAxis domain={[0, 100]} stroke="#6b7280" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="inlet" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
                      <Line type="monotone" dataKey="chamber1" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                      <Line type="monotone" dataKey="chamber2" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                      <Line type="monotone" dataKey="outlet" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-purple-500">
                    No humidity data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Battery Level vs Time Chart */}
            <Card className="bg-violet-200 border-violet-500 border-5">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Battery Level vs Time</CardTitle>
              </CardHeader>
              <CardContent>
                {realBatteryData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart data={realBatteryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="timestamp" stroke="#6b7280" />
                      <YAxis domain={[0, 100]} stroke="#6b7280" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="battery" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No battery data available
                  </div>
                )}
                <p className="text-center text-sm text-gray-500 mt-2">Real-time battery monitoring</p>
              </CardContent>
            </Card>
            </div>
        </div>

        
      </div>
       {/* Footer */}
       <footer className="bg-[#925FE2] text-white text-center py-4 mt-8">
            <p className="text-sm">footer text</p>
        </footer>

    </div>
  )
}
