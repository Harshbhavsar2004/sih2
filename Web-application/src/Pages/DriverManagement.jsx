import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, User, Mail, Phone, CreditCard, MapPin, Calendar, Clock, Edit, Trash } from 'lucide-react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import { useToast } from "@/hooks/use-toast"

export default function DriverManagement() {
  const { toast } = useToast()
  const { id } = useParams()
  const [drivers, setDrivers] = useState([])
  const [filteredDrivers, setFilteredDrivers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isAddingDriver, setIsAddingDriver] = useState(false)
  const [isEditingDriver, setIsEditingDriver] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [newDriver, setNewDriver] = useState({
    DriverName: '',
    Email: '',
    PhoneNumber: '',
    LicenseNumber: '',
    Location: '',
  })

  useEffect(() => {
    fetchDrivers()
    fetchLocationSuggestions()
  }, [])

  useEffect(() => {
    const filtered = drivers.filter(driver => 
      driver.DriverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.PhoneNumber.includes(searchQuery) ||
      driver.LicenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.Location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredDrivers(filtered)
  }, [searchQuery, drivers])

  useEffect(() => {
    if (id) {
      const driver = drivers.find(driver => driver._id === id)
      if (driver) {
        setSelectedDriver(driver)
      }
    }
  }, [id, drivers])

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/drivers')
      const data = await response.json()
      setDrivers(data)
      setFilteredDrivers(data)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }

  const fetchLocationSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/driverlocation')
      const data = await response.json()
      setLocationSuggestions(data.map(location => ({ value: location, label: location })))
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewDriver(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (selectedOption) => {
    setNewDriver(prev => ({ ...prev, Location: selectedOption.value }))
  }

  const handleAddDriver = async () => {
    if (newDriver.PhoneNumber.length !== 10) {
       toast({
        description: "Mobile Number should be 10 Digits."
       })
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDriver),
      })
      const data = await response.json()
      setDrivers(prev => [...prev, { ...newDriver, _id: data.id }])
      setNewDriver({ DriverName: '', Email: '', PhoneNumber: '', LicenseNumber: '', Location: '' })
      setIsAddingDriver(false)
    } catch (error) {
      console.error('Error adding driver:', error)
    }
  }

  const handleEditDriver = async () => {
    if (selectedDriver) {
      if (newDriver.PhoneNumber.length !== 10) {
        toast({
          description:"Phone number must be 10 digits long"
        })
        return
      }

      try {
        const response = await fetch(`http://localhost:3000/api/drivers/${selectedDriver._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDriver),
        })
        const data = await response.json()
        const updatedDrivers = drivers.map(driver => 
          driver._id === selectedDriver._id ? { ...driver, ...newDriver } : driver
        )
        setDrivers(updatedDrivers)
        setSelectedDriver(null)
        setIsEditingDriver(false)
      } catch (error) {
        console.error('Error updating driver:', error)
      }
    }
  }

  const handleDeleteDriver = async () => {
    if (selectedDriver) {
      try {
        await fetch(`http://localhost:3000/api/drivers/${selectedDriver._id}`, {
          method: 'DELETE',
        })
        setDrivers(drivers.filter(driver => driver._id !== selectedDriver._id))
        setSelectedDriver(null)
      } catch (error) {
        console.error('Error deleting driver:', error)
      }
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver)
  }

  const handleEditClick = () => {
    if (selectedDriver) {
      setNewDriver({
        DriverName: selectedDriver.DriverName,
        Email: selectedDriver.Email,
        PhoneNumber: selectedDriver.PhoneNumber,
        LicenseNumber: selectedDriver.LicenseNumber,
        Location: selectedDriver.Location,
      })
      setIsEditingDriver(true)
    }
  }

  return (
    <Navbar>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          <Button onClick={() => setIsAddingDriver(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Driver
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Driver List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow key={driver._id} onClick={() => handleDriverClick(driver)} className="cursor-pointer hover:bg-gray-100">
                    <TableCell className="font-medium">{driver.DriverName}</TableCell>
                    <TableCell>{driver.Email}</TableCell>
                    <TableCell>{driver.PhoneNumber}</TableCell>
                    <TableCell>{driver.LicenseNumber}</TableCell>
                    <TableCell>{driver.Location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedDriver && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Driver Details</span>
                <div className="flex space-x-2">
                  <Button onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Driver Profile
                  </Button>
                  <Button onClick={handleDeleteDriver} variant="destructive">
                    <Trash className="mr-2 h-4 w-4" /> Delete Driver
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name:</span> {selectedDriver.DriverName}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span> {selectedDriver.Email}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Phone:</span> {selectedDriver.PhoneNumber}
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">License Number:</span> {selectedDriver.LicenseNumber}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span> {selectedDriver.Location}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isAddingDriver} onOpenChange={setIsAddingDriver}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>Enter the details of the new driver below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="DriverName" className="text-right">
                  Name
                </Label>
                <Input
                  id="DriverName"
                  name="DriverName"
                  value={newDriver.DriverName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Email" className="text-right">
                  Email
                </Label>
                <Input
                  id="Email"
                  name="Email"
                  type="email"
                  value={newDriver.Email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="PhoneNumber" className="text-right">
                  Phone
                </Label>
                <Input
                  id="PhoneNumber"
                  name="PhoneNumber"
                  value={newDriver.PhoneNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="LicenseNumber" className="text-right">
                  License Number
                </Label>
                <Input
                  id="LicenseNumber"
                  name="LicenseNumber"
                  value={newDriver.LicenseNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Location" className="text-right">
                  Location
                </Label>
                <Select
                  id="Location"
                  name="Location"
                  value={locationSuggestions.find(option => option.value === newDriver.Location)}
                  onChange={handleLocationChange}
                  options={locationSuggestions}
                  className="col-span-3"
                />
              </div>
              <p className='text-red-800 text-sm ml-32'>*You can add Your nearby Location</p>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDriver}>Add Driver</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditingDriver} onOpenChange={setIsEditingDriver}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Driver Profile</DialogTitle>
              <DialogDescription>Update the driver's details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-DriverName" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-DriverName"
                  name="DriverName"
                  value={newDriver.DriverName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-Email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-Email"
                  name="Email"
                  type="email"
                  value={newDriver.Email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-PhoneNumber" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-PhoneNumber"
                  name="PhoneNumber"
                  value={newDriver.PhoneNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-LicenseNumber" className="text-right">
                  License Number
                </Label>
                <Input
                  id="edit-LicenseNumber"
                  name="LicenseNumber"
                  value={newDriver.LicenseNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-Location" className="text-right">
                  Location
                </Label>
                <Select
                  id="edit-Location"
                  name="Location"
                  value={locationSuggestions.find(option => option.value === newDriver.Location)}
                  onChange={handleLocationChange}
                  options={locationSuggestions}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditDriver}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Navbar>
  )
}