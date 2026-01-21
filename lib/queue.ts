// BullMQ queue setup for handling code submissions
import { Queue } from 'bullmq'
import { getRedisClient } from './redis'

export interface SubmissionJobData {
    submissionId: string
    problemId: string
    code: string
    language: 'cpp' | 'python' | 'javascript' | 'java' | 'c' | 'go'
    userId?: string
}

let submissionQueue: Queue<SubmissionJobData> | null = null

export function getSubmissionQueue(): Queue<SubmissionJobData> {
    if (submissionQueue) {
        return submissionQueue
    }

    const connection = getRedisClient()

    submissionQueue = new Queue<SubmissionJobData>('submissions', {
        connection,
        defaultJobOptions: {
            attempts: 3, // Retry failed jobs up to 3 times
            backoff: {
                type: 'exponential',
                delay: 2000, // Start with 2 second delay
            },
            removeOnComplete: {
                count: 100, // Keep last 100 completed jobs
                age: 24 * 3600, // Keep for 24 hours
            },
            removeOnFail: {
                count: 500, // Keep last 500 failed jobs for debugging
            },
        },
    })

    return submissionQueue
}

export async function addSubmissionJob(data: SubmissionJobData) {
    const queue = getSubmissionQueue()

    const job = await queue.add('judge-submission', data, {
        jobId: data.submissionId, // Use submission ID as job ID to prevent duplicates
    })

    return job
}

export async function closeQueue() {
    if (submissionQueue) {
        await submissionQueue.close()
        submissionQueue = null
    }
}
