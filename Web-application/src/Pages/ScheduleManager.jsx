import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from './Navbar';
import axios from 'axios';

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    driver: '',
    bus: '',
    startTime: '',
    endTime: '',
    route: ''
  });

  useEffect(() => {
    // Fetch schedules from backend
    setSchedules([
      { id: 1, driver: 'John Doe', bus: 'Bus 001', startTime: '08:00', endTime: '16:00', route: 'Route A' },
      { id: 2, driver: 'Jane Smith', bus: 'Bus 002', startTime: '09:00', endTime: '17:00', route: 'Route B' },
    ]);

    // Fetch drivers from backend
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('/api/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleDriverChange = async (e) => {
    const selectedDriver = e.target.value;
    setNewSchedule(prev => ({ ...prev, driver: selectedDriver }));

    // Update driver status to unlinked
    const driver = drivers.find(d => d.DriverName === selectedDriver);
    if (driver) {
      try {
        await axios.put(`/api/drivers/${driver._id}/unlink`);
        console.log(`Driver ${selectedDriver} status updated to unlinked`);
      } catch (error) {
        console.error('Error updating driver status:', error);
      }
    }
  };

  const handleAddSchedule = () => {
    const id = schedules.length + 1;
    setSchedules(prev => [...prev, { id, ...newSchedule }]);
    setNewSchedule({ driver: '', bus: '', startTime: '', endTime: '', route: '' });
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  return (
    <Navbar>
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="driver" value={newSchedule.driver} onChange={handleDriverChange} className="input">
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver._id} value={driver.DriverName}>{driver.DriverName}</option>
                ))}
              </select>
              <Input name="bus" placeholder="Bus Number" value={newSchedule.bus} onChange={handleInputChange} />
              <Input name="route" placeholder="Route" value={newSchedule.route} onChange={handleInputChange} />
              <Input name="startTime" type="time" placeholder="Start Time" value={newSchedule.startTime} onChange={handleInputChange} />
              <Input name="endTime" type="time" placeholder="End Time" value={newSchedule.endTime} onChange={handleInputChange} />
              <Button onClick={handleAddSchedule}>
                <Calendar className="mr-2 h-4 w-4" /> Add Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {schedules.map(schedule => (
            <Card key={schedule.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{schedule.driver} - {schedule.bus}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteSchedule(schedule.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p><Clock className="inline mr-2 h-4 w-4" /> {schedule.startTime} - {schedule.endTime}</p>
                <p><Calendar className="inline mr-2 h-4 w-4" /> {schedule.route}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Navbar>
  );
}