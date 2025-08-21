import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export interface AdminProfile {
  id: string
  email: string
  full_name: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  full_name: string
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error getting session:', sessionError)
      return null
    }
    
    if (!session) {
      return null
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Error getting current user:', userError)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

// Sign in with email and password
export async function signInWithEmail(credentials: LoginCredentials) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    
    if (error) {
      console.error('Sign in error:', error)
      throw new Error(error.message)
    }
    
    return data
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

// Sign up with email and password
export async function signUpWithEmail(credentials: SignUpCredentials) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.full_name,
        }
      }
    })
    
    if (error) {
      console.error('Sign up error:', error)
      throw new Error(error.message)
    }
    
    // If signup is successful, create admin profile
    if (data.user) {
      try {
        await createAdminProfile(data.user.id, credentials.email, credentials.full_name)
      } catch (profileError) {
        console.error('Error creating admin profile:', profileError)
        // Don't throw here, as the user was created successfully
      }
    }
    
    return data
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

// Sign out
export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

// Create admin profile
export async function createAdminProfile(userId: string, email: string, fullName: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('admins')
    .insert({
      id: userId,
      email: email,
      full_name: fullName,
    })
  
  if (error) {
    console.error('Error creating admin profile:', error)
    throw new Error('Failed to create admin profile')
  }
}

// Get admin profile
export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error getting admin profile:', error)
    return null
  }
  
  return data
}

// Update admin profile
export async function updateAdminProfile(userId: string, updates: Partial<AdminProfile>) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('admins')
    .update(updates)
    .eq('id', userId)
  
  if (error) {
    throw new Error(error.message)
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  
  const profile = await getAdminProfile(user.id)
  return profile !== null
}
