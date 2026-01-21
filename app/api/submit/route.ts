// POST /api/submit - Submit code for execution
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addSubmissionJob } from '@/lib/queue'
import { validateSubmissionInput, createErrorResponse, createSuccessResponse } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json()

        // Validate input
        const validation = validateSubmissionInput(body)
        if (!validation.valid) {
            return createErrorResponse(validation.error!, 400)
        }

        const { problemId, language, code } = validation.data!

        // Get Supabase client
        const supabase = await createClient()

        // Optional: Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()

        // Verify problem exists
        const { data: problem, error: problemError } = await supabase
            .from('problems')
            .select('id, is_published')
            .eq('id', problemId)
            .single()

        if (problemError || !problem) {
            return createErrorResponse('Problem not found', 404)
        }

        if (!problem.is_published) {
            return createErrorResponse('Problem is not available', 403)
        }

        // Create submission record
        const { data: submission, error: submissionError } = await supabase
            .from('submissions')
            .insert({
                problem_id: problemId,
                user_id: user?.id || null, // Allow anonymous submissions
                language,
                code,
                status: 'QUEUED',
            })
            .select()
            .single()

        if (submissionError || !submission) {
            console.error('Submission creation error:', submissionError)
            return createErrorResponse('Failed to create submission', 500)
        }

        // Add job to queue for worker to process
        try {
            await addSubmissionJob({
                submissionId: submission.id,
                problemId,
                code,
                language,
                userId: user?.id,
            })
        } catch (queueError) {
            console.error('Queue error:', queueError)
            // Update submission status to SYSTEM_ERROR
            await supabase
                .from('submissions')
                .update({
                    status: 'SYSTEM_ERROR',
                    error_message: 'Failed to queue submission for processing'
                })
                .eq('id', submission.id)

            return createErrorResponse('Failed to queue submission. Please try again.', 500)
        }

        // Return submission ID and status
        return createSuccessResponse({
            submissionId: submission.id,
            status: submission.status,
            message: 'Submission queued successfully'
        }, 201)

    } catch (error) {
        console.error('Submit route error:', error)
        return createErrorResponse('Internal server error', 500)
    }
}
