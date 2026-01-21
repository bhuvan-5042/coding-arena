// Redis client configuration for job queue
import { Redis } from 'ioredis'

let redisClient: Redis | null = null

export function getRedisClient(): Redis {
    if (redisClient) {
        return redisClient
    }

    // Support both Upstash (REDIS_URL) and self-hosted Redis
    const redisUrl = process.env.REDIS_URL
    const redisHost = process.env.REDIS_HOST
    const redisPort = process.env.REDIS_PORT
    const redisPassword = process.env.REDIS_PASSWORD

    if (redisUrl) {
        // Upstash or full connection string
        redisClient = new Redis(redisUrl, {
            maxRetriesPerRequest: null, // Required for BullMQ
            enableReadyCheck: false,
        })
    } else if (redisHost) {
        // Self-hosted Redis
        redisClient = new Redis({
            host: redisHost,
            port: redisPort ? parseInt(redisPort, 10) : 6379,
            password: redisPassword,
            maxRetriesPerRequest: null, // Required for BullMQ
            enableReadyCheck: false,
        })
    } else {
        throw new Error(
            'Missing Redis configuration. Please add REDIS_URL or REDIS_HOST to your .env.local file.'
        )
    }

    return redisClient
}

export function closeRedisConnection() {
    if (redisClient) {
        redisClient.disconnect()
        redisClient = null
    }
}
