import React from 'react'
import Dashboard from './Pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import BusDetails from './Pages/BusDetails';
import DriverManagement from './Pages/DriverManagement';
import EmergencyCenter from './Pages/EmergencyCenter';
import ScheduleManager from './Pages/ScheduleManager';
import DriverDetails from './Pages/DriverDetails';


const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/routeDetail' element={<BusDetails/>}/>
      <Route path='/driverManagement' element={<DriverManagement/>}/>
      <Route path="/drivers/:id" component={<DriverManagement/>} />
      <Route path='/driverDetail' element={<DriverDetails/>}/>
      <Route path='/emergency' element={<EmergencyCenter/>}/>
      <Route path='/schedule' element={<ScheduleManager/>}/>
    </Routes>
    </>
  )
}

export default App