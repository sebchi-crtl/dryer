'use client'

import { Eye, EyeOff } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from '@/lib/validations/auth'
import { useLogin, useSignup } from '@/lib/hooks/useAuth'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const { admin, loading } = useAuth()  
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (admin) {
        router.push('/dashboard')
      }
    }
  }, [admin, loading, router])

  const loginMutation = useLogin()
  const signupMutation = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: 'onChange'
  })

  // Type-safe error handling
  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message
  }



  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    try {
      if (isLogin) {
        await loginMutation.mutateAsync(data as LoginFormData)
      } else {
        await signupMutation.mutateAsync(data as SignupFormData)
      }
    } catch (error) {
      // Error is handled by the mutation
      console.error('Form submission error:', error)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    reset()
  }

  const isLoading = loginMutation.isPending || signupMutation.isPending
  const error = loginMutation.error || signupMutation.error

  // Show loading while auth context is initializing
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-violet-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <main className="w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-center justify-center">
          <div className="flex flex-col gap-4 w-full max-w-md px-4 lg:px-0">
            <Image
              src="/onboarding.svg"
              alt="Onboarding icon"
              width={100}
              height={100}
              className="w-full h-auto"
            />
          </div>
          
          {/* Horizontal separator for mobile */}
          <div className="lg:hidden w-full h-px bg-violet-300 my-8"></div>
          
          {/* Vertical separator - hidden on mobile, visible on large screens */}
          <div className="hidden lg:block w-[2px] bg-violet-300 mx-8 self-stretch"></div>
          
          <div className='flex flex-col items-center justify-center px-4'>
            <div className='flex flex-col gap-6 items-center justify-center w-full max-w-md'>
              <div className="text-center text-violet-500 text-4xl md:text-5xl font-semibold font-['Poppins']">
                {isLogin ? 'Login' : 'Sign Up'}
              </div>
              
              <p className="text-violet-500 text-sm md:text-base font-medium">
                {isLogin ? 'welcome back, login to continue' : 'create your account to get started'}
              </p>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200 w-full">
                  {error.message || 'An error occurred'}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-violet-500 text-sm font-medium" htmlFor='full_name'>
                      Enter your full name
                    </label>
                    <input
                      id='full_name'
                      {...register('full_name' as keyof SignupFormData)}
                      type="text"
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        getFieldError('full_name') ? 'border-red-500' : ''
                      }`}
                    />
                    {getFieldError('full_name') && (
                      <p className="text-red-500 text-xs">{getFieldError('full_name')}</p>
                    )}
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-violet-500 text-sm font-medium" htmlFor='email'>
                    Enter your email
                  </label>
                  <input
                    id='email'
                    {...register('email')}
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className={`w-full px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      getFieldError('email') ? 'border-red-500' : ''
                    }`}
                  />
                  {getFieldError('email') && (
                    <p className="text-red-500 text-xs">{getFieldError('email')}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-violet-500 text-sm font-medium" htmlFor='password'>
                    Enter your password
                  </label>
                  <div className="relative">
                    <input
                      id='password'
                      {...register('password')}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12 ${
                        getFieldError('password') ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {getFieldError('password') && (
                    <p className="text-red-500 text-xs">{getFieldError('password')}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                {isLogin && (
                  <div className="text-right">
                    <a href="#" className="text-violet-500 text-sm underline hover:text-violet-400">
                      Forgot password?
                    </a>
                  </div>
                )}

                {/* Login/Signup Button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-violet-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign Up')}
                </button>

                {/* Sign Up/Login Link */}
                <div className="text-center">
                  <span className="text-violet-500 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </span>
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-violet-500 text-sm underline hover:text-violet-400"
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div> 
  )
}

export default Login