'use client'

import React from 'react'
import { 
  Bell, 
  ChevronDown, 
  Thermometer, 
  Droplets, 
  Battery, 
  Fan,
  Leaf,
  Download,
  Home
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
    label: "outlet",
    color: "#ef4444",
  },
  battery: {
    label: "Battery",
    color: "#8b5cf6",
  },
}

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-violet-500 text-white px-4 py-3 shadow-lg rounded-b-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold">EcoDryer</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1 hover:bg-violet-600 px-3 py-2 rounded-lg transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Reports</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button className="hover:bg-violet-600 p-2 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
              <span className="font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Controls Bar */}
      <div className="bg-violet-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <Select defaultValue="24h">
              <SelectTrigger className="w-32">
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
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Export</span>
            <Select defaultValue="export">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Temperature Card */}
          <div className="lg:col-span-1 bg-violet-50 rounded-xl p-6 shadow-sm border border-violet-200">
            <div className="flex items-center space-x-2 mb-4">
              <Thermometer className="h-6 w-6 text-violet-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Temperature</h3>
                <p className="text-sm text-gray-500">Dryer temperature</p>
              </div>
            </div>
            
            <div className="text-right mb-6">
              <div className="text-4xl font-bold text-violet-600">69%</div>
              <p className="text-sm text-gray-500">average Temperature</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">inlet</p>
                <p className="text-lg font-semibold text-gray-900">68 (T1)</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">Dryer chamber</p>
                <p className="text-lg font-semibold text-gray-900">68 (T2)</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">Dryer chamber</p>
                <p className="text-lg font-semibold text-gray-900">68 (T3)</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">outlet</p>
                <p className="text-lg font-semibold text-gray-900">68 (T4)</p>
              </div>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="lg:col-span-1 bg-violet-50 rounded-xl p-6 shadow-sm border border-violet-200">
            <div className="flex items-center space-x-2 mb-4">
              <Droplets className="h-6 w-6 text-violet-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Relative Humidity</h3>
                <p className="text-sm text-gray-500">Dryer humidity</p>
              </div>
            </div>
            
            <div className="text-right mb-6">
              <div className="text-4xl font-bold text-violet-600">69%</div>
              <p className="text-sm text-gray-500">average Humidity</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">inlet</p>
                <p className="text-lg font-semibold text-gray-900">68 (H1)</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">Dryer chamber</p>
                <p className="text-lg font-semibold text-gray-900">68 (H2)</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">Dryer chamber</p>
                <p className="text-lg font-semibold text-gray-900">68 (H3)</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <p className="text-xs text-gray-500">outlet</p>
                <p className="text-lg font-semibold text-gray-900">68 (H4)</p>
              </div>
            </div>
          </div>

          {/* Status and Condition Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-violet-50 rounded-xl p-6 shadow-sm border border-violet-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status and condition</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">System Status:</p>
                  <p className="text-xl font-bold text-green-600">Low</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Door Status:</p>
                  <p className="text-xl font-bold text-blue-600">Unlocked</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Battery Level</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={100} className="flex-1" />
                    <span className="text-sm font-semibold text-gray-900">100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fan Speed Card */}
            <div className="bg-violet-50 rounded-xl p-6 shadow-sm border border-violet-200">
              <div className="flex items-center space-x-2 mb-4">
                <Fan className="h-6 w-6 text-violet-600" />
                <h3 className="text-lg font-semibold text-gray-900">Fan speed</h3>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">System Status:</p>
                <p className="text-xl font-bold text-green-600">Low</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - Full Width Columns */}
        <div className="space-y-6">
          {/* Temperature vs Time Chart */}
          <Card className="bg-violet-50 border-violet-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Temperature vs Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="inlet" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
                  <Line type="monotone" dataKey="chamber1" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                  <Line type="monotone" dataKey="chamber2" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  <Line type="monotone" dataKey="outlet" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Humidity vs Time Chart */}
          <Card className="bg-violet-50 border-violet-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Humidity vs Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={humidityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="inlet" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
                  <Line type="monotone" dataKey="chamber1" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                  <Line type="monotone" dataKey="chamber2" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  <Line type="monotone" dataKey="outlet" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Battery Level vs Time Chart */}
          <Card className="bg-violet-50 border-violet-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Battery Level vs Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={batteryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="battery" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                </LineChart>
              </ChartContainer>
              <p className="text-center text-sm text-gray-500 mt-2">---2020</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-violet-600 text-white text-center py-4 mt-8">
        <p className="text-sm">footer text</p>
      </footer>
    </div>
  )
}

export default Dashboard
