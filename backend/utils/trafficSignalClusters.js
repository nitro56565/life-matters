import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const clusters = [];
// Connect to the MongoDB database
export async function createClusters() {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("life-matters-db");
    const collection = db.collection("test-traffic-signals");

    // Fetch all traffic signals
    const trafficSignals = await collection.find({}).toArray();

    console.log("First Signal Coordinates:", trafficSignals[0]?.features[0]?.geometry);

    const radius = 100; // in meters

    // Function to calculate the Haversine distance between two lat/long points
    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in meters
    }

    // Function to find the cluster the point belongs to
    function findCluster(lat, lon) {
        for (let cluster of clusters) {
            for (let signal of cluster) {
                if (haversine(lat, lon, signal.lat, signal.lon) <= radius) {
                    cluster.push({ lat, lon });
                    return;
                }
            }
        }
        // If no cluster was found, create a new one
        clusters.push([{ lat, lon }]);
    }

    // Loop through all traffic signals and group them into clusters
    trafficSignals.forEach(signal => {
        signal.features.forEach(feature => {
            const [lon, lat] = feature.geometry.coordinates; // Coordinates are [lon, lat]
            findCluster(lat, lon);
        });
    });

    // Flatten clusters and add unique IDs with the `data` key
    const flattenedClusters = clusters.map((cluster, index) => ({
        id: index + 1, // Assign a unique ID
        data: cluster[0] // Take only the first marker of each cluster
    }));


    return flattenedClusters;
}
export { clusters }