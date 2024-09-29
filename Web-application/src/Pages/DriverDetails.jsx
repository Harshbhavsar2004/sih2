import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Phone, User } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Navbar from './Navbar'

const drivers = [
  { id: 'D001', name: 'John Doe', phone: '1234567890' },
  { id: 'D002', name: 'Jane Smith', phone: '0987654321' },
  { id: 'D003', name: 'Bob Johnson', phone: '1122334455' },
]

const generateAttendanceData = () => {
  const data = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      present: Math.random() > 0.2
    })
  }
  return data
}

const attendanceData = generateAttendanceData()

const shiftData = [
  { date: '2023-06-01', shift: 'Morning' },
  { date: '2023-06-02', shift: 'Evening' },
  { date: '2023-06-03', shift: 'Night' },
  { date: '2023-06-04', shift: 'Morning' },
  { date: '2023-06-05', shift: 'Evening' },
]

const COLORS = ['#22c55e', '#ef4444']

export default function DriverDetails() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver)
  }

  const handleBackToList = () => {
    setSelectedDriver(null)
  }

  const handleDownloadData = () => {
    if (selectedDriver) {
      const doc = new jsPDF()
      
      // Add Driver Details
      doc.text(`Driver Details: ${selectedDriver.name}`, 10, 10)
      doc.text(`ID: ${selectedDriver.id}`, 10, 20)
      doc.text(`Phone: ${selectedDriver.phone}`, 10, 30)

      // Attendance Table
      const attendanceTable = attendanceData.map(day => [
        day.date, day.present ? 'Present' : 'Absent'
      ])

      doc.text('Attendance (Last 30 Days)', 10, 40)
      doc.autoTable({
        head: [['Date', 'Status']],
        body: attendanceTable,
        startY: 45
      })

      // Shift Data Table
      const shiftTable = shiftData.map(shift => [shift.date, shift.shift])
      doc.text('Recent Shifts', 10, doc.lastAutoTable.finalY + 10)
      doc.autoTable({
        head: [['Date', 'Shift']],
        body: shiftTable,
        startY: doc.lastAutoTable.finalY + 15
      })

      // Download the PDF
      doc.save(`${selectedDriver.name}_details.pdf`)
    }
  }

  const renderCalendar = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeks = []
    let week = []

    attendanceData.forEach((day, index) => {
      const date = new Date(day.date)
      if (index === 0 || date.getDay() === 0) {
        if (week.length > 0) {
          weeks.push(week)
        }
        week = Array(date.getDay()).fill(null)
      }
      week.push(day)
      if (index === attendanceData.length - 1) {
        weeks.push(week)
      }
    })

    return (
      <div className="mt-4 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600">{day}</div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
            {week.map((day, dayIndex) => (
              <div key={`${weekIndex}-${dayIndex}`} className="text-center">
                {day ? (
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm ${day.present ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {new Date(day.date).getDate()}
                  </div>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const presentDays = attendanceData.filter(day => day.present).length
  const pieChartData = [
    { name: 'Present', value: presentDays },
    { name: 'Absent', value: 30 - presentDays },
  ]

  return (
   <Navbar>
     <div className="space-y-6">
      {!selectedDriver ? (
        <>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search driver by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrivers.map(driver => (
              <Card key={driver.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleDriverClick(driver)}>
                <CardHeader>
                  <CardTitle>{driver.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><User className="inline mr-2" /> ID: {driver.id}</p>
                  <p><Phone className="inline mr-2" /> Phone: {driver.phone}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={handleBackToList}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Driver Details: {selectedDriver.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Driver ID</p>
                    <p className="mt-1 text-lg font-semibold">{selectedDriver.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="mt-1 text-lg font-semibold">{selectedDriver.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Past 30 Days Attendance</h3>
                  {renderCalendar()}
                  
                  <div className="mt-4 flex justify-between items-center bg-gray-100 rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Present</p>
                      <p className="mt-1 text-2xl font-bold text-green-600">{presentDays} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Absent</p>
                      <p className="mt-1 text-2xl font-bold text-red-600">{30 - presentDays} days</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Recent Shifts</h3>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {shiftData.map((shift, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{shift.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{shift.shift}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Attendance Overview</h3>
                  <div className="bg-white rounded-lg shadow p-4" style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="default" onClick={handleDownloadData}>
                    <Download className="mr-2 h-4 w-4" /> Download Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
   </Navbar>
  )
}
