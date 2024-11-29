import { MongoClient } from 'mongodb';
import geolib from 'geolib'; // For calculating the distance between two points
import dotenv from 'dotenv';

dotenv.config();

const uri = "mongodb+srv://maheshpatil1612:nitro%40123@cluster0.1ofjgnt.mongodb.net/life-matters-db?retryWrites=true&w=majority&appName=Cluster0"; // Use environment variable for MongoDB URI

const client = new MongoClient(uri);

export async function findNearbyTrafficSignals(routePoints) {
    try {
        await client.connect();
        const db = client.db("life-matters-db");
        const collection = db.collection("test-traffic-signals");

        // Find the min and max latitudes and longitudes for the entire route
        let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;

        // Loop through all route points to find the min and max latitudes and longitudes
        for (const point of routePoints) {
            const { lat, lng } = point;
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
        }

        // Calculate the bounding box using the min/max latitudes and longitudes
        const bbox = [
            [minLng, minLat], // Bottom-left corner of the bounding box
            [maxLng, maxLat]  // Top-right corner of the bounding box
        ];

        // Query MongoDB for traffic signals within the bounding box using an optimized query
        const nearbySignals = await collection.find({
            "features.geometry.coordinates": {
                $geoWithin: {
                    $box: bbox
                }
            }
        }).toArray();

        if (nearbySignals.length === 0) {
            console.log("No traffic signals found within the bounding box.");
            return [];
        }

        // To optimize, loop over only those route points that match the traffic signal data
        const routePointMap = new Map(routePoints.map(point => [point.id, point])); // Map route points by id for faster lookup

        const matchingSignals = [];

        // Check each feature in the traffic signal data
        for (const signal of nearbySignals) {
            // Loop through all features in the current signal data
            for (const feature of signal.features) {
                // Make sure the feature has a geometry and coordinates
                if (feature.geometry && feature.geometry.coordinates) {
                    const { coordinates } = feature.geometry;
                    const signalLat = coordinates[1];
                    const signalLng = coordinates[0];

                    // Optimized: Loop through route points and check for matches only when within bounding box
                    for (const point of routePoints) {
                        const { lat, lng } = point;
                        // Calculate the distance only if the point is inside the bounding box
                        if (lat >= bbox[0][1] && lat <= bbox[1][1] && lng >= bbox[0][0] && lng <= bbox[1][0]) {
                            const distance = geolib.getDistance(
                                { latitude: lat, longitude: lng },
                                { latitude: signalLat, longitude: signalLng }
                            );

                            // If the signal is within 5 meters, add it to the matching signals list
                            if (distance <= 5) {
                                matchingSignals.push({
                                    routePointId: point.id,
                                    trafficSignal: feature
                                });
                            }
                        }
                    }
                }
            }
        }

        // Return the matching signals
        return matchingSignals;
    } catch (err) {
        console.error("Error connecting to the database:", err);
        throw new Error("Error connecting to the database");
    } finally {
        await client.close();
    }
}