import express from 'express';
import data from './thunder-file_47c4b857.json' assert { type: 'json' };
const driverlocationRouter = express.Router();

driverlocationRouter.get('/driverlocation', (req, res) => {
  const locations = data.map(item => item.startLocation);
  res.json(locations);
});

export default driverlocationRouter;