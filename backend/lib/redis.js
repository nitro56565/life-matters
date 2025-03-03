import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: {},
});

// Example Redis Functions
async function setCache(key, value, expiration = 3600) {
  await redisClient.set(key, JSON.stringify(value), 'EX', expiration);
}

async function getCache(key) {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

async function deleteCache(key) {
  await redisClient.del(key);
}

export { redisClient, setCache, getCache, deleteCache };