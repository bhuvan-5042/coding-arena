// POST /api/auth/signup - User registration
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, username, displayName } = body

        // Validate input
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return createErrorResponse('Invalid email address', 400)
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            return createErrorResponse('Password must be at least 6 characters', 400)
        }

        if (!username || typeof username !== 'string' || username.length < 3) {
            return createErrorResponse('Username must be at least 3 characters', 400)
        }

        // Username validation (alphanumeric and underscores only)
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return createErrorResponse('Username can only contain letters, numbers, and underscores', 400)
        }

        const supabase = await createClient()

        // Check if username already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single()

        if (existingUser) {
            return createErrorResponse('Username already taken', 409)
        }

        // Sign up with email and password
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            return createErrorResponse(error.message, 400)
        }

        if (!data.user) {
            return createErrorResponse('Failed to create user account', 500)
        }

        // Create user profile
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: data.user.id,
                email,
                username,
                display_name: displayName || username,
            })

        if (profileError) {
            console.error('Profile creation error:', profileError)
            // Note: Auth user was created, but profile failed
            // You may want to handle this with a cleanup job
            return createErrorResponse('Account created but profile setup failed', 500)
        }

        return createSuccessResponse({
            user: data.user,
            session: data.session,
            message: 'Account created successfully',
        }, 201)

    } catch (error) {
        console.error('Signup route error:', error)
        return createErrorResponse('Internal server error', 500)
    }
}
