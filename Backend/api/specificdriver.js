import express from "express";
import axios from "axios"; // Import axios

const driverSpecificRouter = express.Router();

driverSpecificRouter.post("/schedule/driverspecific", async (req, res) => {
  const { driverName } = req.body;
  console.log(driverName);
  if (!driverName) {
    return res.status(400).json({ error: "Driver name is required" });
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/schedule/linked`);
    if (response.status === 200) {
      const allData = response.data.data;
      const driverData = allData.find(duty => duty.driver === driverName);
      if (driverData) {
        res.status(200).json(driverData);
      } else {
        res.status(404).json({ error: "Driver not found" });
      }
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching driver-specific data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default driverSpecificRouter;