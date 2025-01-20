import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import TrafficPoliceData from '../models/TrafficPoliceData.js';
import dotenv from 'dotenv';
import { unfilteredClusters, initializeClusters } from '../index.js';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

// Sign-up Route
router.post('/signup', async (req, res) => {
    (async () => {
        await initializeClusters();
    })();
    try {
        const { cluster: zoneId, name, phone, password } = req.body;

        // Validate input fields
        if (!zoneId || !name || !phone || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Replace cluster with clusterZone
        const clusterZone = unfilteredClusters[zoneId - 1];

        if (!clusterZone) {
            return res.status(404).json({ message: `Cluster with ID ${zoneId} not found` });
        }

        // Check if the phone number is already registered
        let trafficPolice = await TrafficPoliceData.findOne({ phone });
        if (trafficPolice) {
            return res
                .status(400)
                .json({ message: 'Traffic police phone number already registered' });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new TrafficPoliceData document
        const trafficPoliceData = {
            name,
            phone,
            password: hashedPassword, // Save encrypted password
            clusterZone, // Save clusterZone
        };

        trafficPolice = new TrafficPoliceData(trafficPoliceData);
        await trafficPolice.save();

        // Generate JWT token
        const payload = {
            trafficPolice: {
                id: trafficPolice.id,
                name: trafficPolice.name,
            },
        };

        const JWT_SECRET = process.env.JWT_SECRET_TOKEN;
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;

            // Send response
            res.status(201).json({
                message: 'Traffic police registered successfully',
                data: trafficPolice,
                token, // Return JWT token
            });

            console.log('Traffic police registration data:', trafficPoliceData);
        });
    } catch (error) {
        console.error('Error registering traffic police:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Sign-in Route
router.post('/signin', async (req, res) => {
    const { phone, password } = req.body;

    // Validate input
    if (!phone || !password) {
        return res.status(400).json({ message: 'Phone and password are required.' });
    }

    try {
        // Check if the traffic police user exists
        const trafficPolice = await TrafficPoliceData.findOne({ phone });
        if (!trafficPolice) {
            return res.status(400).json({ message: 'Invalid phone number or password.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, trafficPolice.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid phone number or password.' });
        }
        // Generate a JWT token
        const payload = { trafficPolice: { id: trafficPolice.id, name: trafficPolice.name, clusterZone: trafficPolice.clusterZone, } };
        const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;

            // Respond with the token and user type
            res.status(200).json({
                message: 'Sign-in successful.',
                token,
                userType: 'trafficPolice',
                name: trafficPolice.name,
                clusterZone: trafficPolice.clusterZone
            });
        });
    } catch (error) {
        console.error('Error during sign-in:', error.message);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

export default router;