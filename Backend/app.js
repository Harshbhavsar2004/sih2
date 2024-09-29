import express from 'express';
import router from './router/router.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import driverRouter from './router/Driver.js';
import driverotp from './api/Driverotp.js';
import driverlocationRouter from "./api/driverlocation.js"
import dotenv from 'dotenv';
import getUserData from './api/driverVerification.js';
import driverSpecificRouter from "./api/specificDriver.js"
dotenv.config();
const app = express();
const PORT =  3000;


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',   // Local frontend (if needed)
      'exp://192.168.43.199:8081', // Replace with the IP address of your React Native development server
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow the request if the origin is in the allowed list or if there's no origin (like for non-browser clients)
      callback(null, true);
    } else {
      // Reject the request if the origin is not allowed
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};


app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use("/api", router);
app.use("/api", driverRouter);
app.use("/api", driverlocationRouter);
app.use("/api", driverotp);
app.use("/api", getUserData);
app.use("/api", driverSpecificRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});