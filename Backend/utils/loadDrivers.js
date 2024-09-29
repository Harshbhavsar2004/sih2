import Driver from "../model/driver.model.js";

const drivers = {};
let unlinkedDrivers = [];

const loadDriversFromDatabase = async () => {
  try {
    const driverDocs = await Driver.find({});
    driverDocs.forEach((doc) => {
      drivers[doc.DriverName] = {
        ...doc.toObject(),
        remainingTime: 10 * 60 * 60,
      }; // 10 hours in seconds
      if (doc.status === "unlinked") {
        unlinkedDrivers.push(doc.DriverName);
      }
    });
    console.log("Drivers loaded from database");
  } catch (error) {
    console.error("Error loading drivers from database:", error);
  }
};

export { loadDriversFromDatabase, drivers, unlinkedDrivers };