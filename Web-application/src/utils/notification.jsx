import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Simulated notification fetch
    const mockNotifications = [
      { id: '1', message: 'Emergency: Bus breakdown on Route 5', type: 'emergency', timestamp: new Date() },
      { id: '2', message: 'Driver John Doe authorized', type: 'info', timestamp: new Date(Date.now() - 3600000) },
    ]
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.length)
  }, [])

  const handleMarkAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={handleMarkAsRead}>
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-2 mb-2 rounded ${
                notification.type === 'emergency' ? 'bg-red-100' : 'bg-blue-100'
              }`}
            >
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {notification.timestamp.toLocaleString()}
              </p>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
