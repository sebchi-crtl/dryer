'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

interface AuthAdmin {
  id: string
  email: string
  full_name?: string
}

interface AuthContextType {
  admin: AuthAdmin | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AuthAdmin | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchAdminProfile = async (supabaseUser: User) => {
    // Simply use the auth user data without fetching from admins table
    setAdmin({
      id: supabaseUser.id,
      email: supabaseUser.email!,
      full_name: supabaseUser.user_metadata?.full_name
    })
    console.log('Admin:', supabaseUser)
  }
  console.log('Admin set:', admin)
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session:', session?.user)
      if (session?.user) {
        await fetchAdminProfile(session?.user as User)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      
      async (event, session) => {
        console.log('sub:', subscription);
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          await fetchAdminProfile(session.user)
        } else {
          setAdmin(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
