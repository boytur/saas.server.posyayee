const redis = require('redis');

const cache = redis.createClient({
    url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}`,
});

cache.on('error', (err) => {
    console.error('Redis cache error', err);
});

async function connectRedis() {
    try {
        await cache.connect();
        console.log('POSYAYEE-V2 app connected to Redis cache');

    } catch (err) {
        console.error('Could not connect to Redis', err);
        throw err;
    }
}

module.exports = { cache, connectRedis };
