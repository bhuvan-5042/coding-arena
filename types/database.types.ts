// Database type definitions for Supabase tables
// Generated types for the coding-arena database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      problems: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          tags: string[]
          time_limit_ms: number
          memory_limit_mb: number
          starter_code_cpp: string | null
          starter_code_python: string | null
          starter_code_javascript: string | null
          example_input: string | null
          example_output: string | null
          constraints: string | null
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          tags?: string[]
          time_limit_ms?: number
          memory_limit_mb?: number
          starter_code_cpp?: string | null
          starter_code_python?: string | null
          starter_code_javascript?: string | null
          example_input?: string | null
          example_output?: string | null
          constraints?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          tags?: string[]
          time_limit_ms?: number
          memory_limit_mb?: number
          starter_code_cpp?: string | null
          starter_code_python?: string | null
          starter_code_javascript?: string | null
          example_input?: string | null
          example_output?: string | null
          constraints?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      test_cases: {
        Row: {
          id: string
          problem_id: string
          input: string
          expected_output: string
          is_example: boolean
          is_hidden: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          problem_id: string
          input: string
          expected_output: string
          is_example?: boolean
          is_hidden?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          problem_id?: string
          input?: string
          expected_output?: string
          is_example?: boolean
          is_hidden?: boolean
          order_index?: number
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string | null
          problem_id: string
          language: 'cpp' | 'python' | 'javascript' | 'java' | 'c' | 'go'
          code: string
          status: 'QUEUED' | 'RUNNING' | 'ACCEPTED' | 'WRONG_ANSWER' | 
                  'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 
                  'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'SYSTEM_ERROR'
          total_test_cases: number
          passed_test_cases: number
          execution_time_ms: number | null
          memory_used_mb: number | null
          score: number
          error_message: string | null
          submitted_at: string
          judged_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          problem_id: string
          language: 'cpp' | 'python' | 'javascript' | 'java' | 'c' | 'go'
          code: string
          status?: 'QUEUED' | 'RUNNING' | 'ACCEPTED' | 'WRONG_ANSWER' | 
                   'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 
                   'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'SYSTEM_ERROR'
          total_test_cases?: number
          passed_test_cases?: number
          execution_time_ms?: number | null
          memory_used_mb?: number | null
          score?: number
          error_message?: string | null
          submitted_at?: string
          judged_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          problem_id?: string
          language?: 'cpp' | 'python' | 'javascript' | 'java' | 'c' | 'go'
          code?: string
          status?: 'QUEUED' | 'RUNNING' | 'ACCEPTED' | 'WRONG_ANSWER' | 
                   'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 
                   'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'SYSTEM_ERROR'
          total_test_cases?: number
          passed_test_cases?: number
          execution_time_ms?: number | null
          memory_used_mb?: number | null
          score?: number
          error_message?: string | null
          submitted_at?: string
          judged_at?: string | null
        }
      }
      submission_results: {
        Row: {
          id: string
          submission_id: string
          test_case_id: string
          status: 'PASSED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 
                  'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR'
          execution_time_ms: number | null
          memory_used_mb: number | null
          actual_output: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          test_case_id: string
          status: 'PASSED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 
                  'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR'
          execution_time_ms?: number | null
          memory_used_mb?: number | null
          actual_output?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          test_case_id?: string
          status?: 'PASSED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 
                   'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR'
          execution_time_ms?: number | null
          memory_used_mb?: number | null
          actual_output?: string | null
          error_message?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
