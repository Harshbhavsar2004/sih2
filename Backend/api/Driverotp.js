import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Driver from '../model/driver.model.js';
import dotenv from 'dotenv';
import Twilio from 'twilio';
dotenv.config();

const driverotp = express.Router();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = new Twilio(accountSid, authToken);

// JWT secret key
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Endpoint to check if the driver exists
driverotp.post('/check-driver', async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    const driver = await Driver.findOne({ PhoneNumber: mobileNumber });
    if (driver) {
      res.status(200).send({ isValid: true });
    } else {
      res.status(404).send({ isValid: false });
    }
  } catch (error) {
    console.error('Error checking driver:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Endpoint to send OTP
driverotp.post('/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    const formattedNumber = formatPhoneNumber(mobileNumber);
    const verification = await client.verify.v2.services(verifySid)
      .verifications.create({ to: formattedNumber, channel: 'sms' });
    console.log(`OTP sent to ${formattedNumber}: ${verification.status}`);
    res.status(200).send({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send({ message: 'Error sending OTP' });
  }
});

// Endpoint to verify OTP and generate token
driverotp.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;
  try {
    const formattedNumber = formatPhoneNumber(mobileNumber);
    const verification_check = await client.verify.v2.services(verifySid)
      .verificationChecks.create({ to: formattedNumber, code: otp });
    if (verification_check.status === 'approved') {
      const driver = await Driver.findOne({ PhoneNumber: mobileNumber });
      const token = jwt.sign({ id: driver._id }, jwtSecret, { expiresIn: '15d' });

      // Save the token to the driver's tokens array
      driver.tokens.push(token);
      await driver.save();

      res.status(200).send({ token });
    } else {
      res.status(401).send({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Function to format phone number to E.164 format
const formatPhoneNumber = (phoneNumber) => {
  // Assuming the phone number is an Indian number without the country code
  const countryCode = '+91'; // Replace with your country code if different
  return `${countryCode}${phoneNumber}`;
};

export default driverotp;