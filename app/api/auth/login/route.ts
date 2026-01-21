// POST /api/auth/login - User login
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        // Validate input
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return createErrorResponse('Invalid email address', 400)
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            return createErrorResponse('Password must be at least 6 characters', 400)
        }

        // Get Supabase client
        const supabase = await createClient()

        // Sign in with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return createErrorResponse(error.message, 401)
        }

        // Fetch user profile
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

        return createSuccessResponse({
            user: data.user,
            profile,
            session: data.session,
        })

    } catch (error) {
        console.error('Login route error:', error)
        return createErrorResponse('Internal server error', 500)
    }
}
