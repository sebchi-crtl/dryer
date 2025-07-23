'use client'

import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import Image from 'next/image'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

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
                Login
                </div>
                
                <p className="text-violet-500 text-sm md:text-base font-medium">
                welcome back, login to continue
                </p>

                <div className="w-full space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-violet-500 text-sm font-medium" htmlFor='email'>
                    Enter your email
                    </label>
                    <input
                    id='email'
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className="w-full px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <label className="text-violet-500 text-sm font-medium" htmlFor='password'>
                    Enter your password
                    </label>
                    <div className="relative">
                    <input
                        id='password'
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                        
                    </button>
                    </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                    <a href="#" className="text-violet-500 text-sm underline hover:text-violet-400">
                    Forgot password?
                    </a>
                </div>

                {/* Login Button */}
                <button className="w-full bg-violet-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-violet-600 transition-colors">
                    Login
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                    <span className="text-violet-500 text-sm">
                    Don't have an account?{" "}
                    </span>
                    <a href="/register" className="text-violet-500 text-sm underline hover:text-violet-400">
                    Sign Up
                    </a>
                </div>
                </div>
            </div>
            </div>
        </div>
      </main>
    </div> 
  )
}

export default Login