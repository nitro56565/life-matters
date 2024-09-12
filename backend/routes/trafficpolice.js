import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import TrafficPoliceData from '../models/TrafficPoliceData.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

// Sign-up Route
router.post('/signup', async (req, res) => {
    const { name, location, phone, password } = req.body;

    try {
        // Check if the traffic police phone number is already registered
        let trafficPolice = await TrafficPoliceData.findOne({ phone });
        if (trafficPolice) {
            return res.status(400).json({ msg: 'Traffic police phone number already registered' }); // Updated field name
        }

        // Create a new traffic police document
        const hashedPassword = await bcrypt.hash(password, 10);
        trafficPolice = new TrafficPoliceData({
            name,
            location,
            phone,
            password: hashedPassword,
        });

        await trafficPolice.save();

        // Generate JWT token
        const payload = {
            trafficPolice: {
                id: trafficPolice.id,
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Sign-in Route
router.post('/signin', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ msg: 'Phone and password are required' });
    }

    try {
        let trafficPolice = await TrafficPoliceData.findOne({ phone });
        if (!trafficPolice) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, trafficPolice.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { trafficPolice: { id: trafficPolice.id } };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            // Return the token and user type
            res.json({ token, userType: 'trafficPolice' });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

export default router;