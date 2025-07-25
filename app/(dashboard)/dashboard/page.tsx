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
  Home,
  BellRing
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

  const StatusCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-2">
      <span className="text-sm font-semibold text-white">{label}:</span>
      <span className="text-3xl font-bold text-gray-50">{value}</span>
    </div>
  );
  
  const SensorCard = ({ title, data, average, icon }: any) => (
    <Card className="bg-gradient-to-br from-[#A87AF0] to-[#905EE0] text-white p-4 rounded-2xl shadow-lg w-full border-none">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-2xl font-bold flex items-center gap-2">{icon} {title}</div>
          <div className="text-sm text-white/70">Dryer {title.toLowerCase()}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{average}</div>
          <div className="text-sm text-white/70">average {title}</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 min-lg:gap-6">
        {data.map(({ label, value, id }: any) => (
          <Card key={id} className="bg-[#E1D4F7] text-[#905EE0] text-center p-3">
            <div className="text-lg font-semibold h-9">{label}</div>
            <div className="text-xl font-bold">{value}</div>
            <div className="text-xs -mt-4">{id}</div>
          </Card>
        ))}
      </div>
    </Card>
  );

const Dashboard = () => {

    const temperatureData = [
        { label: "inlet", value: 68, id: "T1" },
        { label: "Dryer chamber", value: 68, id: "T2" },
        { label: "Dryer chamber", value: 68, id: "T3" },
        { label: "outlet", value: 68, id: "T4" },
      ];
    
      const humidityData = [
        { label: "inlet", value: 68, id: "H1" },
        { label: "Dryer chamber", value: 68, id: "H2" },
        { label: "Dryer chamber", value: 68, id: "H3" },
        { label: "outlet", value: 68, id: "H4" },
      ];
  return (
    <div className="min-h-screen bg-[#DFCFF7] w-full">
      <div className="container mx-auto max-w-5xl pt-24 px-4">
            
        
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-[#925FE2] to-[#BF96FF] text-white px-4 py-3 shadow-lg rounded-3xl mb-10">
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
                        <span className="text-sm font-medium">JD</span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center space-x-1 hover:bg-violet-600 px-3 py-2 rounded-lg transition-colors">
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem><span className="font-medium">John Doe</span></DropdownMenuItem>
                            <DropdownMenuItem>Help</DropdownMenuItem>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            </div>
        </nav>

        <div className="p-6 space-y-4 max-w-screen-xl mx-auto">
            <div className="flex justify-between gap-2">
                <Button variant="outline" className="bg-purple-200 text-purple-900 hover:bg-purple-300">
                Time Range: 24 hours <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="bg-purple-200 text-purple-900 hover:bg-purple-300">
                Export <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                <SensorCard
                    title="Temperature"
                    average="69°C"
                    icon={<span>🌡️</span>}
                    data={temperatureData}
                />
                <SensorCard
                    title="Relative Humidity"
                    average="69%"
                    icon={<span>💧</span>}
                    data={humidityData}
                />
                </div>

                <div className="space-y-4">
                <Card className="bg-gradient-to-tr from-[#925FE2] to-[#DFCFF7] p-6 border-none text-purple-900 font-semibold text-lg rounded-2xl shadow-md">
                    <CardContent className="space-y-3">
                    <StatusCard label="System Status" value="Low" />
                    <StatusCard label="Door Status" value="Unlocked" />
                    <StatusCard label="Battery Level" value="100" />
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-bl border-none from-[#925FE2] to-[#DFCFF7] p-6 text-purple-900 font-semibold text-lg rounded-2xl shadow-md">
                    <CardContent>
                    <StatusCard label="System Status" value="Low" />
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>

        {/* Controls Bar */}
        <div className=" px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex items-center space-x-4 bg-[#925FE2] rounded-lg px-4 py-1">
                <span className="text-sm font-medium text-gray-50">Time Range:</span>
                <Select defaultValue="24h">
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
                <Select defaultValue="export">
                <SelectTrigger className="w-10 bg-[#1a033f] text-white">
                    <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="export"></SelectItem>
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

            {/* Charts Section - Full Width Columns */}
            <div className="space-y-6">
            {/* Temperature vs Time Chart */}
            <Card className="bg-violet-50 border-violet-200 w-full">
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

        
      </div>
       {/* Footer */}
       <footer className="bg-[#925FE2] text-white text-center py-4 mt-8">
            <p className="text-sm">footer text</p>
        </footer>

    </div>
  )
}

export default Dashboard
