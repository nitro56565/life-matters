import { MongoClient } from 'mongodb';
import geolib from 'geolib'; // For calculating the distance between two points
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URL;
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
            if (!lat || !lng) {
                console.error("Invalid route point:", point);
                continue;
            }
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

        console.log(bbox);

        // Aggregation pipeline to get signals in bounding box
        const nearbySignals = await collection.aggregate([
            {
                $unwind: "$features"  // Unwind the features array
            },
            {
                $match: {
                    "features.geometry.coordinates": {
                        $geoWithin: {
                            $box: bbox  // Use the dynamic bounding box
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",  // Group by the original document _id
                    features: { $push: "$features" }  // Rebuild the features array with only matching ones
                }
            }
        ]).toArray();

        console.log("Traffic signals in the bounding box:", nearbySignals);

        if (nearbySignals.length === 0) {
            console.log("No traffic signals found within the bounding box.");
            return [];
        }

        const matchingSignals = [];
        const addedSignalCoordinates = new Set();  // To store unique coordinates of added signals

        // Check each feature in the traffic signal data
        for (const signal of nearbySignals) {
            for (const feature of signal.features) {
                if (feature.geometry && feature.geometry.coordinates) {
                    const { coordinates } = feature.geometry;
                    const signalLat = coordinates[1];
                    const signalLng = coordinates[0];

                    if (!signalLat || !signalLng) {
                        console.error("Missing signal coordinates:", feature);
                        continue;
                    }

                    // Create a key based on coordinates (latitude and longitude)
                    const signalKey = `${signalLat}-${signalLng}`;

                    // Check if this signal's coordinates have already been added
                    if (!addedSignalCoordinates.has(signalKey)) {
                        // Now iterate through route points to find matches
                        for (const { lat, lng, id } of routePoints) {
                            if (!lat || !lng) {
                                console.error("Route point missing lat or lng:", { lat, lng });
                                continue;
                            }

                            const distance = geolib.getDistance(
                                { latitude: lat, longitude: lng },
                                { latitude: signalLat, longitude: signalLng }
                            );

                            // If the distance is within the threshold (e.g., 20 meters)
                            if (distance <= 20) {
                                matchingSignals.push({
                                    routePointId: id,
                                    trafficSignal: feature
                                });

                                // Add this signal's coordinates to the set of added signals
                                addedSignalCoordinates.add(signalKey); // Mark this signal as added
                                break;  // No need to check further points for this signal
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