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
      if (assignedTripsSet.has(trip.trip_id)) return;
  
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
  
      if (lastEndTime && startTime <= lastEndTime) return;
  
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

export default findBestTrip;
