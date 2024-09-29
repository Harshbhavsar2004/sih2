import express from 'express';
import Driver from '../model/driver.model.js';
import axios from 'axios';

const driverRouter = express.Router();
const openCageApiKey = "1ff8b27a87d64e5d802f3d06af799e22"; // Replace with your OpenCage API key

const preprocessLocation = async (location) => {
  console.log(`Preprocessing location: ${location}`);
  return `${location}, delhi`;
};

const getLatLng = async (location) => {
  const cleanedLocation = await preprocessLocation(location);
  console.log(`Cleaned location: ${cleanedLocation}`);
  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      cleanedLocation
    )}&key=${openCageApiKey}`
  );
  if (response.data.results.length > 0) {
    const { lat, lng } = response.data.results[0].geometry;
    console.log(`Converted location: lat=${lat}, lng=${lng}`);
    return { lat, lng };
  } else {
    console.error(`No results found for location: ${cleanedLocation}`);
    throw new Error('No results found for location');
  }
};

driverRouter.post('/drivers', async (req, res) => {
  try {
    const { lat, lng } = await getLatLng(req.body.Location);

    const driver = new Driver({
      DriverName: req.body.DriverName,
      Location: req.body.Location,
      Email: req.body.Email,
      PhoneNumber: req.body.PhoneNumber,
      LicenseNumber: req.body.LicenseNumber,
      homeLat: lat,
      homeLon: lng
    });

    const result = await driver.save();
    res.status(201).send({ message: 'Driver added successfully', id: result._id });
  } catch (err) {
    console.error('Error adding driver:', err);
    res.status(500).send({ message: 'Error adding driver', error: err.message });
  }
});

// New GET method to retrieve all drivers
driverRouter.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (err) {
    console.error('Error retrieving drivers:', err);
    res.status(500).send({ message: 'Error retrieving drivers', error: err.message });
  }
});

export default driverRouter;