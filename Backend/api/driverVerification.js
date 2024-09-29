import express from 'express';
import jwt from 'jsonwebtoken';
import Driver from '../model/driver.model.js';

const getUserData = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

getUserData.get('/get-user-data', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const driver = await Driver.findById(decoded.id);
    console.log(driver);

    if (!driver) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({
      DriverName: driver.DriverName,
      Location: driver.Location,
      Email: driver.Email,
      PhoneNumber: driver.PhoneNumber,
      LicenseNumber: driver.LicenseNumber,
      tokens: driver.tokens,
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

export default getUserData;