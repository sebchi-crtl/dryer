import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import { 
  loginSchema, 
  createUserSchema, 
  adminProfileSchema,
  type LoginInput,
  type CreateUserInput,
} from './schemas'
import { toast } from 'sonner'

// Authentication API
export const authApi = {
  // Login mutation
  useLogin: () => {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: async (data: LoginInput) => {
        const validatedData = loginSchema.parse(data)
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        })
        if (error) throw error
        return { success: true }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] })
        toast.success('Login successful!')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Login failed')
      },
    })
  },

  // Logout mutation
  useLogout: () => {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { success: true }
      },
      onSuccess: () => {
        queryClient.clear()
        toast.success('Logged out successfully')
      },
      onError: (error: any) => {
        toast.error('Error logging out')
      },
    })
  },

  // Get current admin profile
  useAdminProfile: () => {
    return useQuery({
      queryKey: ['admin', 'profile'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No authenticated user')

        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        return adminProfileSchema.parse(data)
      },
      enabled: false, // Only fetch when explicitly called
    })
  },
}

// Admin management API (simplified - no creation/deletion)
export const adminApi = {
  // List all admins (read-only)
  useListAdmins: () => {
    return useQuery({
      queryKey: ['admins'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return data.map(admin => adminProfileSchema.parse(admin))
      },
    })
  },
}
