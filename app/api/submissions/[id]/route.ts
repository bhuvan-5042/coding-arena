// GET /api/submissions/[id] - Fetch submission status and results
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createErrorResponse, createSuccessResponse, isValidUUID } from '@/lib/utils'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Validate UUID
        if (!isValidUUID(id)) {
            return createErrorResponse('Invalid submission ID', 400)
        }

        const supabase = await createClient()

        // Optional: Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()

        // Fetch submission
        const { data: submission, error: submissionError } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single()

        if (submissionError || !submission) {
            return createErrorResponse('Submission not found', 404)
        }

        // Check if user has access to this submission
        if (submission.user_id && user?.id !== submission.user_id) {
            return createErrorResponse('Access denied', 403)
        }

        // Fetch test case results
        const { data: results, error: resultsError } = await supabase
            .from('submission_results')
            .select(`
        id,
        status,
        execution_time_ms,
        memory_used_mb,
        actual_output,
        error_message,
        test_cases (
          id,
          input,
          expected_output,
          is_example
        )
      `)
            .eq('submission_id', id)

        if (resultsError) {
            console.error('Results fetch error:', resultsError)
        }

        // Return submission with results
        return createSuccessResponse({
            submission: {
                ...submission,
                results: results || [],
            },
        })

    } catch (error) {
        console.error('Submission detail route error:', error)
        return createErrorResponse('Internal server error', 500)
    }
}
