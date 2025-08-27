import { z } from 'zod'

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().optional(),
})

// Admin profile schema
export const adminProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})


// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type AdminProfile = z.infer<typeof adminProfileSchema>

// Auth types (for backward compatibility)
export interface AuthAdmin {
  id: string
  email: string
}
