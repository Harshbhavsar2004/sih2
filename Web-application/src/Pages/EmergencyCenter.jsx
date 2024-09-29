import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';

export default function EmergencyCenter() {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    setEmergencies([
      { id: 1, driverId: 'D001', busId: 'B001', issue: 'Engine failure', status: 'pending' },
      { id: 2, driverId: 'D002', busId: 'B002', issue: 'Flat tire', status: 'resolved' },
    ]);

    // Set up WebSocket connection for real-time updates
    const socket = new WebSocket('ws://your-backend-url');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'emergency') {
        setEmergencies(prev => [...prev, data.emergency]);
      }
    };

    return () => socket.close();
  }, []);

  const handleResolve = (id) => {
    // In a real application, you would send this update to your backend
    setEmergencies(emergencies.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
  };

  return (
    <Navbar>
      <div className="space-y-4">
      {emergencies.map(emergency => (
        <Card key={emergency.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Report #{emergency.id}</CardTitle>
            {emergency.status === 'pending' ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <p><strong>Driver ID:</strong> {emergency.driverId}</p>
            <p><strong>Bus ID:</strong> {emergency.busId}</p>
            <p><strong>Issue:</strong> {emergency.issue}</p>
            <p><strong>Status:</strong> {emergency.status}</p>
            {emergency.status === 'pending' && (
              <Button onClick={() => handleResolve(emergency.id)} className="mt-2">
                Mark as Resolved
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
    </Navbar>
  );
}
