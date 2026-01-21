// GET /api/problems - Fetch all problems
import { createClient } from '@/lib/supabase/server'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'

export async function GET() {
    try {
        const supabase = await createClient()

        // Fetch all published problems (exclude test cases and full code)
        const { data: problems, error } = await supabase
            .from('problems')
            .select('id, title, slug, difficulty, tags, constraints, created_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Problems fetch error:', error)
            return createErrorResponse('Failed to fetch problems', 500)
        }

        return createSuccessResponse({
            problems: problems || [],
            count: problems?.length || 0,
        })

    } catch (error) {
        console.error('Problems route error:', error)
        return createErrorResponse('Internal server error', 500)
    }
}
