import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { redisClient } from '../lib/redis.js';

const router = express.Router();

// Aggregated Endpoint: Fetch Traffic Police and Ambulance Data
router.post('/trafficpolice/full-data', async (req, res) => {
  try {
    // Read trafficPoliceId from the request body
    const { trafficPoliceId } = req.body;
    console.log(`[TrafficPolice Full Data] Received request for trafficPoliceId: ${trafficPoliceId}`);
    if (!trafficPoliceId) {
      console.error(`[TrafficPolice Full Data] Missing trafficPoliceId in request body`);
      return res.status(400).json({ message: 'Missing trafficPoliceId in request body' });
    }
    
    // Construct the key for the traffic police record
    const policeKey = `trafficPolice:${trafficPoliceId}`;
    // Fetch the "ambulance_ids" field from the traffic police record
    let tpData = await redisClient.hget(policeKey, "ambulance_ids");
    if (!tpData) {
      console.error(`[TrafficPolice Full Data] Traffic police data not found for id: ${trafficPoliceId}`);
      return res.status(404).json({ message: 'Traffic police data not found' });
    }
    
    // Parse the stored ambulance IDs array
    const ambulanceIds = JSON.parse(tpData);
    console.log(`[TrafficPolice Full Data] Found ambulanceIds for trafficPoliceId ${trafficPoliceId}:`, ambulanceIds);

    // Generate keys for ambulance data using the correct key format
    const ambulanceKeys = ambulanceIds.map(id => `ambulance:${id}`);
    console.log(`[TrafficPolice Full Data] Generated ambulance keys:`, ambulanceKeys);

    // Retrieve each ambulance's data using hgetall (lower-case)
    let ambulanceDataArray = await Promise.all(
      ambulanceKeys.map(async (key) => {
        const data = await redisClient.hgetall(key);
        console.log(`[TrafficPolice Full Data] Data for key ${key}:`, data);
        return data;
      })
    );
    
    // Optionally filter out any empty objects (in case some keys were not found)
    ambulanceDataArray = ambulanceDataArray.filter(data => Object.keys(data).length > 0);
    console.log(`[TrafficPolice Full Data] Aggregated ambulance records:`, ambulanceDataArray);

    // Return the aggregated result
    console.log(`[TrafficPolice Full Data] Successfully fetched aggregated data.`);
    return res.status(200).json({ ambulanceData: ambulanceDataArray });
  } catch (error) {
    console.error("[TrafficPolice Full Data] Error fetching aggregated data from Redis:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;