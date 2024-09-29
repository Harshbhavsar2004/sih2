const calculateTripDuration = (stopTimesForTrip) => {
    if (!stopTimesForTrip || stopTimesForTrip.length === 0) {
      console.error('Invalid stopTimesForTrip:', stopTimesForTrip);
      return 0;
    }
  
    // Ensure stopTimesForTrip contains strings
    const startTime = typeof stopTimesForTrip[0] === 'string' ? stopTimesForTrip[0] : stopTimesForTrip[0].arrival_time;
    const endTime = typeof stopTimesForTrip[stopTimesForTrip.length - 1] === 'string' ? stopTimesForTrip[stopTimesForTrip.length - 1] : stopTimesForTrip[stopTimesForTrip.length - 1].arrival_time;
    console.log(`Calculating duration from ${startTime} to ${endTime}`); // Debugging line
  
    if (!startTime || !endTime) {
      console.error('Invalid startTime or endTime:', startTime, endTime);
      return 0;
    }
  
    const [startHour, startMinute, startSecond] = startTime.split(':').map(Number);
    const [endHour, endMinute, endSecond] = endTime.split(':').map(Number);
  
    const startInSeconds = startHour * 3600 + startMinute * 60 + startSecond;
    const endInSeconds = endHour * 3600 + endMinute * 60 + endSecond;
  
    return endInSeconds - startInSeconds;
  };
  
  export default calculateTripDuration;