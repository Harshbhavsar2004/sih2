import express from "express";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import connectToDatabase from "../db/connection.js";
import AssignedDuty from "../model/assignedDuty.model.js"; // Assuming you have this model
import calculateDistance from "../utils/calculateDistance.js"; // Assuming these utility functions exist
import calculateTripDuration from "../utils/calculateTripDuration.js";
import { loadDriversFromDatabase } from "../utils/loadDrivers.js";
import Driver from "../model/driver.model.js"; // Import the Driver model
import { log } from "console";

connectToDatabase();

const router = express.Router();

const assignedTripsSet = new Set();
const routes = {};
const stops = {};
const trips = {};
const stopTimes = {};
const assignedTrips = [];
let calculatedData = []; // Store the calculated data
let allAssignedDuties = []; // Store all assigned duties

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    console.log(`Loading file: ${filePath}`); // Debugging line
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

const loadData = async () => {
  try {
    const basePath = path.resolve(__dirname, "../GTFS");
    const routesData = await loadCSV(path.join(basePath, "routes.txt"));
    routesData.forEach((row) => {
      routes[row.route_id] = row;
    });
    console.log("Routes loaded");

    const stopsData = await loadCSV(path.join(basePath, "stops.txt"));
    stopsData.forEach((row) => {
      stops[row.stop_id] = row;
    });
    console.log("Stops loaded");

    const tripsData = await loadCSV(path.join(basePath, "trips.txt"));
    tripsData.forEach((row) => {
      trips[row.trip_id] = row;
    });
    console.log("Trips loaded");

    const stopTimesData = await loadCSV(path.join(basePath, "stop_times.txt"));
    stopTimesData.forEach((row) => {
      if (!stopTimes[row.trip_id]) {
        stopTimes[row.trip_id] = [];
      }
      stopTimes[row.trip_id].push(row);
    });
    console.log("Stop times loaded");

    await loadDriversFromDatabase(); // Load drivers from MongoDB
    assignedTrips.length = 0;
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

await loadData();

const findBestTrip = (
  currentLat,
  currentLon,
  lastEndTime,
  assignedTripsSet,
  homeLat,
  homeLon,
  maxDistance,
  isLastTrip = false,
  isFirstTrip = false
) => {
  let bestTrip = null;
  let minDistance = Infinity;

  Object.values(trips).forEach((trip) => {
    if (assignedTripsSet.has(trip.trip_id)) {
      console.log(`Trip ${trip.trip_id} already assigned`);
      return;
    }

    const startStopId = stopTimes[trip.trip_id][0].stop_id;
    const endStopId =
      stopTimes[trip.trip_id][stopTimes[trip.trip_id].length - 1].stop_id;
    const startLat = parseFloat(stops[startStopId].stop_lat);
    const startLon = parseFloat(stops[startStopId].stop_lon);
    const endLat = parseFloat(stops[endStopId].stop_lat);
    const endLon = parseFloat(stops[endStopId].stop_lon);
    const startTime = stopTimes[trip.trip_id][0].departure_time;

    const distanceToStart = calculateDistance(
      currentLat,
      currentLon,
      startLat,
      startLon
    );
    const distanceToHome = calculateDistance(endLat, endLon, homeLat, homeLon);

    if (lastEndTime && startTime <= lastEndTime) {
      return;
    }

    if (isLastTrip) {
      if (distanceToHome < minDistance && distanceToStart <= maxDistance) {
        minDistance = distanceToHome;
        bestTrip = trip;
      }
    } else if (isFirstTrip) {
      if (distanceToStart < minDistance) {
        minDistance = distanceToStart;
        bestTrip = trip;
      }
    } else {
      if (distanceToStart < minDistance && distanceToStart <= maxDistance) {
        minDistance = distanceToStart;
        bestTrip = trip;
      }
    }
  });

  return bestTrip;
};

const assignDutyForDriver = async (driver) => {
  const maxDistance = 20; // Maximum distance in km for "near" consideration
  const maxTrips = 3; // Maximum number of trips per driver

  if (!driver) {
    console.error(`Driver not found`);
    return; // Exit the function if the driver is not found
  }

  if (driver.status !== "linked") {
    console.error(`Driver is not linked: ${driver.DriverName}`);
    return; // Skip unlinked drivers
  }

  const homeLat = driver.homeLat;
  const homeLon = driver.homeLon;

  if (homeLat === undefined || homeLon === undefined) {
    console.error(`Driver location not set for driver: ${driver.DriverName}`);
    console.log(`Driver data: ${JSON.stringify(driver, null, 2)}`);
    return; // Exit the function if the driver's location is not set
  }

  let currentLat = homeLat;
  let currentLon = homeLon;
  let totalDuration = 0;
  let driverTrips = [];
  let lastEndTime = null;

  console.log(`Assigning duty for driver: ${driver.DriverName}`);
  console.log(`Home location: lat=${homeLat}, lon=${homeLon}`);

  let firstTrip = findBestTrip(
    homeLat,
    homeLon,
    null,
    assignedTripsSet,
    homeLat,
    homeLon,
    maxDistance,
    false,
    true
  );
  if (firstTrip) {
    const startStopId = stopTimes[firstTrip.trip_id][0].stop_id;
    const endStopId =
      stopTimes[firstTrip.trip_id][stopTimes[firstTrip.trip_id].length - 1]
        .stop_id;
    const startLocation = stops[startStopId].stop_name;
    const endLocation = stops[endStopId].stop_name;

    const stopsForTrip = stopTimes[firstTrip.trip_id].map(
      (stopTime) => stops[stopTime.stop_id].stop_name
    );
    const stopTimesForTrip = stopTimes[firstTrip.trip_id].map(
      (stopTime) => stopTime.arrival_time
    );

    const tripDuration = calculateTripDuration(stopTimesForTrip);
    totalDuration += tripDuration;

    driverTrips.push({
      driver: driver.DriverName,
      route: firstTrip.route_id,
      trip: firstTrip.trip_id,
      startLocation: startLocation,
      endLocation: endLocation,
      stops: stopsForTrip,
      stopTimes: stopTimesForTrip,
      tripDuration: tripDuration,
    });

    assignedTripsSet.add(firstTrip.trip_id); // Add to global set

    currentLat = parseFloat(stops[endStopId].stop_lat);
    currentLon = parseFloat(stops[endStopId].stop_lon);
    lastEndTime =
      stopTimes[firstTrip.trip_id][stopTimes[firstTrip.trip_id].length - 1]
        .arrival_time;
  }

  while (driverTrips.length < maxTrips) {
    const nextTrip = findBestTrip(
      currentLat,
      currentLon,
      lastEndTime,
      assignedTripsSet,
      homeLat,
      homeLon,
      maxDistance
    );

    if (!nextTrip) {
      break;
    }

    const startStopId = stopTimes[nextTrip.trip_id][0].stop_id;
    const endStopId =
      stopTimes[nextTrip.trip_id][stopTimes[nextTrip.trip_id].length - 1]
        .stop_id;
    const startLocation = stops[startStopId].stop_name;
    const endLocation = stops[endStopId].stop_name;

    const stopsForTrip = stopTimes[nextTrip.trip_id].map(
      (stopTime) => stops[stopTime.stop_id].stop_name
    );
    const stopTimesForTrip = stopTimes[nextTrip.trip_id].map(
      (stopTime) => stopTime.arrival_time
    );

    const tripDuration = calculateTripDuration(stopTimesForTrip);
    totalDuration += tripDuration;

    driverTrips.push({
      driver: driver.DriverName,
      route: nextTrip.route_id,
      trip: nextTrip.trip_id,
      startLocation: startLocation,
      endLocation: endLocation,
      stops: stopsForTrip,
      stopTimes: stopTimesForTrip,
      tripDuration: tripDuration,
    });

    assignedTripsSet.add(nextTrip.trip_id); // Add to global set

    currentLat = parseFloat(stops[endStopId].stop_lat);
    currentLon = parseFloat(stops[endStopId].stop_lon);
    lastEndTime =
      stopTimes[nextTrip.trip_id][stopTimes[nextTrip.trip_id].length - 1]
        .arrival_time;
  }

  driverTrips.forEach((trip, index) => {
    console.log(`Trip ${index + 1}:`);
    console.log(`  Start Location: ${trip.startLocation}`);
    console.log(`  End Location: ${trip.endLocation}`);
    console.log(
      `  Trip Duration: ${(trip.tripDuration / 3600).toFixed(2)} hours`
    );
    if (index > 0) {
      const prevTrip = driverTrips[index - 1];
      const prevEndStopId =
        stopTimes[prevTrip.trip][stopTimes[prevTrip.trip].length - 1].stop_id;
      const currentStartStopId = stopTimes[trip.trip][0].stop_id;

      const prevEndLat = parseFloat(stops[prevEndStopId].stop_lat);
      const prevEndLon = parseFloat(stops[prevEndStopId].stop_lon);
      const currentStartLat = parseFloat(stops[currentStartStopId].stop_lat);
      const currentStartLon = parseFloat(stops[currentStartStopId].stop_lon);

      console.log(`  Previous End Lat: ${prevEndLat}, Lon: ${prevEndLon}`);
      console.log(
        `  Current Start Lat: ${currentStartLat}, Lon: ${currentStartLon}`
      );

      if (
        !isNaN(prevEndLat) &&
        !isNaN(prevEndLon) &&
        !isNaN(currentStartLat) &&
        !isNaN(currentStartLon)
      ) {
        const distanceBetweenTrips = calculateDistance(
          prevEndLat,
          prevEndLon,
          currentStartLat,
          currentStartLon
        );
        console.log(
          `  Distance from previous trip end to current trip start: ${distanceBetweenTrips.toFixed(
            2
          )} km`
        );
      } else {
        console.log(
          "  Distance from previous trip end to current trip start: Invalid coordinates"
        );
      }
    }
  });
  console.log("---");

  // Store the assigned duty in the database
  const assignedDuty = new AssignedDuty({
    driver: driver.DriverName,
    route: driverTrips.map((trip) => trip.route),
    tripIDs: driverTrips.map((trip) => trip.trip),
    trips: driverTrips.map((trip, index) => {
      const prevTrip = driverTrips[index - 1];
      const distanceFromPreviousTrip = prevTrip
        ? calculateDistance(
            parseFloat(
              stops[
                stopTimes[prevTrip.trip][stopTimes[prevTrip.trip].length - 1]
                  .stop_lat
              ]
            ),
            parseFloat(
              stops[
                stopTimes[prevTrip.trip][stopTimes[prevTrip.trip].length - 1]
                  .stop_lon
              ]
            ),
            parseFloat(stops[stopTimes[trip.trip][0].stop_lat]),
            parseFloat(stops[stopTimes[trip.trip][0].stop_lon])
          )
        : 0;

      return {
        startLocation: trip.startLocation,
        endLocation: trip.endLocation,
        tripDuration: (trip.tripDuration / 3600).toFixed(2) + " hours",
        distanceFromPreviousTrip: distanceFromPreviousTrip.toFixed(2) + " km",
        stops: trip.stops,
        stopTimes: trip.stopTimes,
      };
    }),
    totalScheduledTime:
      (
        driverTrips.reduce((acc, trip) => acc + trip.tripDuration, 0) / 3600
      ).toFixed(2) + " hours",
  });

  await assignedDuty.save();

  return assignedDuty;
};

// Function to assign duties to all drivers one by one
const assignDutiesToAllDrivers = async () => {
  try {
    const drivers = await Driver.find({ status: "linked" });
    allAssignedDuties = []; // Reset the global variable
    for (const driver of drivers) {
      // Check if the driver already has an assigned duty
      const existingDuty = await AssignedDuty.findOne({ driver: driver.DriverName }).sort({ createdAt: -1 });
      if (existingDuty) {
        const now = new Date();
        const lastAssignedAt = new Date(existingDuty.createdAt);
        const sixAMToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);

        if (lastAssignedAt >= sixAMToday) {
          console.log(`Driver ${driver.DriverName} already has an assigned duty for today`);
          continue;
        }
      }

      const assignedDuty = await assignDutyForDriver(driver);
      if (assignedDuty) {
        allAssignedDuties.push(assignedDuty);
      }
    }
  } catch (error) {
    console.error("Error assigning duties to all drivers:", error);
  }
};

// Optionally, set up a cron job to run this function at a specific interval
cron.schedule("0 6 * * *", async () => {
  console.log("Running scheduled duty assignment for all drivers");
  await assignDutiesToAllDrivers();
});

// New GET endpoint to retrieve assigned duties
router.get("/schedule/linked", async (req, res) => {
  try {
    const assignedDuties = await AssignedDuty.find();
    res.status(200).json({
      stops: stops,
      data: assignedDuties,
    });
  } catch (error) {
    console.error("Error retrieving assigned duties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

await assignDutiesToAllDrivers();


export default router;