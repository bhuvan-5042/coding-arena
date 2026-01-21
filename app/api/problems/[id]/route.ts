// GET /api/problems/[id] - Fetch single problem with details
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
            return createErrorResponse('Invalid problem ID', 400)
        }

        const supabase = await createClient()

        // Fetch problem details
        const { data: problem, error: problemError } = await supabase
            .from('problems')
            .select('*')
            .eq('id', id)
            .eq('is_published', true)
            .single()

        if (problemError || !problem) {
            return createErrorResponse('Problem not found', 404)
        }

        // Fetch example test cases only (not hidden ones)
        const { data: testCases, error: testCasesError } = await supabase
            .from('test_cases')
            .select('id, input, expected_output, order_index')
            .eq('problem_id', id)
            .eq('is_example', true)
            .order('order_index', { ascending: true })

        if (testCasesError) {
            console.error('Test cases fetch error:', testCasesError)
        }

        // Return problem with example test cases
        return createSuccessResponse({
            problem: {
                ...problem,
                exampleTestCases: testCases || [],
            },
        })

    } catch (error) {
        console.error('Problem detail route error:', error)
        return createErrorResponse('Internal server error', 500)
    }
}
