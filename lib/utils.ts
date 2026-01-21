// Utility functions for API routes

export const SUPPORTED_LANGUAGES = ['cpp', 'python', 'javascript', 'java', 'c', 'go'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

export const SUBMISSION_STATUSES = [
    'QUEUED',
    'RUNNING',
    'ACCEPTED',
    'WRONG_ANSWER',
    'TIME_LIMIT_EXCEEDED',
    'MEMORY_LIMIT_EXCEEDED',
    'RUNTIME_ERROR',
    'COMPILATION_ERROR',
    'SYSTEM_ERROR',
] as const
export type SubmissionStatus = typeof SUBMISSION_STATUSES[number]

export function isValidLanguage(language: string): language is SupportedLanguage {
    return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
}

export function isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
}

export function createErrorResponse(message: string, status: number = 400) {
    return Response.json(
        { error: message },
        { status }
    )
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
    return Response.json(data, { status })
}

export function validateSubmissionInput(body: unknown): {
    valid: boolean
    error?: string
    data?: {
        problemId: string
        language: SupportedLanguage
        code: string
    }
} {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Invalid request body' }
    }

    const { problemId, language, code } = body as Record<string, unknown>

    if (!problemId || typeof problemId !== 'string' || !isValidUUID(problemId)) {
        return { valid: false, error: 'Invalid problem ID' }
    }

    if (!language || typeof language !== 'string' || !isValidLanguage(language)) {
        return {
            valid: false,
            error: `Invalid language. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
        }
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
        return { valid: false, error: 'Code cannot be empty' }
    }

    if (code.length > 100000) { // 100KB limit
        return { valid: false, error: 'Code exceeds maximum length (100KB)' }
    }

    return {
        valid: true,
        data: {
            problemId,
            language,
            code: code.trim(),
        },
    }
}
