import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import Navbar from "./Navbar";

const BusDetails = () => {
  const [data, setData] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/schedule/linked")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDriverChange = (driverName) => {
    setSelectedDriver(driverName);
    setDriverSearch(driverName);
    setSelectedRoute("");
    setShowSuggestions(false); // Hide suggestions when a driver is selected
  };

  const handleRouteChange = (value) => {
    setSelectedRoute(value);
    console.log("Selected Route: ", value); // Debugging route selection
  };

  const handleDriverSearchChange = (event) => {
    setDriverSearch(event.target.value);
    setShowSuggestions(true); // Show suggestions when typing
  };

  const handleRemoveMap = () => {
    setSelectedRoute("");
  };

  const filteredDrivers = data
    ? data.data.filter((driver) =>
        driver.driver.toLowerCase().includes(driverSearch.toLowerCase())
      )
    : [];

  // Move driverData outside to share with both select and displayTrips
  const driverData = data
    ? data.data.find((driver) => driver.driver === selectedDriver)
    : null;

  const displayTrips = () => {
    if (!driverData || !selectedRoute) return null;

    const trip = driverData.trips.find(
      (trip, index) => driverData.route[index] === selectedRoute
    );

    if (!trip) {
      console.error(`Trip data not found for route: ${selectedRoute}`);
      return null;
    }

    const latlngs = trip.stops
      .map((stopName) => {
        const stopId = Object.keys(data.stops).find(
          (key) => data.stops[key].stop_name === stopName
        );
        if (stopId) {
          return [
            parseFloat(data.stops[stopId].stop_lat),
            parseFloat(data.stops[stopId].stop_lon),
          ];
        }
        return null;
      })
      .filter((latlng) => latlng !== null);

    return (
      <>
        {latlngs.map((latlng, index) => (
          <Marker key={index} position={latlng}>
            <Popup>
              Stop {index + 1}: {trip.stops[index]}
              <br />
              Stop Time: {trip.stopTimes[index]}
            </Popup>
          </Marker>
        ))}
        <Polyline positions={latlngs} color="blue">
          <Popup>Route: {selectedRoute}</Popup>
        </Polyline>
      </>
    );
  };

  return (
    <Navbar>
      <div className="p-4">
        <div className="mb-4 flex items-center gap-5 relative">
          <div className="relative">
            <Input
              type="text"
              value={driverSearch}
              onChange={handleDriverSearchChange}
              placeholder="Search Driver"
              className="mr-2 p-2 border border-gray-300 rounded"
            />
            <Search className="absolute right-2 top-2 text-gray-400" />
            {showSuggestions && filteredDrivers.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-2 w-full max-h-40 overflow-y-auto">
                {filteredDrivers.map((driver) => (
                  <li
                    key={driver.driver}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleDriverChange(driver.driver)}
                  >
                    {driver.driver}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Select
            id="routeSelect"
            value={selectedRoute}
            onValueChange={handleRouteChange}
            className="p-2 border border-gray-300 rounded"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Route" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {driverData?.route?.length > 0 ? (
                  driverData.route.map((routeId,index) => (
                    <SelectItem key={index} value={routeId}>
                      {routeId}
                    </SelectItem>
                  ))
                ) : (
                  <p>No Routes Available</p> // Display message if no routes are present
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {data && selectedDriver && selectedRoute && (
            <p>
              Total Scheduled Time:{" "}
              {
                data.data.find((driver) => driver.driver === selectedDriver)
                  ?.totalScheduledTime
              }
            </p>
          )}
          {selectedRoute && (
            <X
              onClick={handleRemoveMap}
              className="cursor-pointer absolute right-0 "
            />
          )}
        </div>
        {selectedRoute && (
          <div id="map" className="h-[500px] w-full">
            <MapContainer
              center={[28.6139,77.209]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {displayTrips()}
            </MapContainer>
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default BusDetails;
