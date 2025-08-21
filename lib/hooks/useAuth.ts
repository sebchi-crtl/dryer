import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from '@/lib/validations/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const validatedData = loginSchema.parse(data)
      const { error } = await signIn(validatedData.email, validatedData.password)
      if (error) throw error
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success('Login successful!')
      // Redirect after successful login
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed')
    },
  })
}

export const useSignup = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const validatedData = signupSchema.parse(data)
      // For signup, we need to call Supabase directly since AuthContext doesn't have signup
      const { createClient } = await import('@/utils/supabase/client')
      const supabase = createClient()
      
      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.full_name,
          }
        }
      })
      if (error) throw error
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success('Signup successful!')
      // Redirect after successful signup
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Signup failed')
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const { signOut } = useAuth()

  return useMutation({
    mutationFn: async () => {
      await signOut()
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
}
