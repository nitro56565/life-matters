import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AmbulanceData from '../models/AmbulanceData.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

// Sign up Route
router.post('/signup', async (req, res) => {
    const { name, hospitalName, vehicleNumber, phone, password } = req.body;

    try {
        // Create a new ambulance document
        const ambulance = new AmbulanceData({
            name,
            hospitalName,
            vehicleNumber,
            phone,
            password,
        });

        await ambulance.save();

        // Generate JWT token
        const payload = {
            ambulance: {
                id: ambulance.id,
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expiration time
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

// Sign In Route
router.post('/signin', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ msg: 'Phone and password are required' });
    }

    try {
        // Find the ambulance by phone number
        let ambulance = await AmbulanceData.findOne({ phone });
        if (!ambulance) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, ambulance.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = {
            ambulance: {
                id: ambulance.id,
            },
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            // Return the token and user type
            res.json({ token, userType: 'ambulance' });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

export default router;