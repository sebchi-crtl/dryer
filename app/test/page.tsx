'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function TestPage() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [envVars, setEnvVars] = useState<any>({})

  const checkEnvVars = () => {
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...' || 'Not set',
      keyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...' || 'Not set'
    })
  }

  const testBasicConnection = async () => {
    setStatus('Testing basic connection...')
    setError('')
    
    try {
      const supabase = createClient()
      console.log('Supabase client created successfully')
      setStatus('✅ Supabase client created successfully')
    } catch (err: any) {
      setError(`❌ Client creation failed: ${err.message}`)
      setStatus('Client creation failed')
    }
  }

  const testAuthConnection = async () => {
    setStatus('Testing auth connection...')
    setError('')
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setError(`❌ Auth error: ${error.message}`)
        setStatus('Auth test failed')
      } else {
        setStatus('✅ Auth connection successful')
      }
    } catch (err: any) {
      setError(`❌ Auth client error: ${err.message}`)
      setStatus('Auth test failed')
    }
  }

  const testDatabaseConnection = async () => {
    setStatus('Testing database connection...')
    setError('')
    
    try {
      const supabase = createClient()
      
      // Try a simple query first
      const { data, error } = await supabase
        .from('dryer_data')
        .select('id')
        .limit(1)
      
      if (error) {
        setError(`❌ Database error: ${error.message}`)
        setStatus('Database test failed')
      } else {
        setStatus('✅ Database connection successful')
      }
    } catch (err: any) {
      setError(`❌ Database client error: ${err.message}`)
      setStatus('Database test failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="space-y-6">
          {/* Environment Variables Check */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <button 
              onClick={checkEnvVars}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
              Check Environment Variables
            </button>
            
            {Object.keys(envVars).length > 0 && (
              <div className="space-y-2 text-sm">
                <p><strong>URL:</strong> {envVars.url}</p>
                <p><strong>Key:</strong> {envVars.key}</p>
                <p><strong>URL Value:</strong> {envVars.urlValue}</p>
                <p><strong>Key Value:</strong> {envVars.keyValue}</p>
              </div>
            )}
          </div>

          {/* Connection Tests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>
            
            <div className="space-y-3">
              <button 
                onClick={testBasicConnection}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Test Client Creation
              </button>
              
              <button 
                onClick={testAuthConnection}
                className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
              >
                Test Auth Connection
              </button>
              
              <button 
                onClick={testDatabaseConnection}
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Test Database Connection
              </button>
            </div>
          </div>

          {/* Status Display */}
          {status && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <div className="p-3 bg-gray-100 rounded">
                {status}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Error</h2>
              <div className="p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            </div>
          )}

          {/* Troubleshooting Guide */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Make sure you have a `.env.local` file in your project root</p>
              <p><strong>2.</strong> Verify your Supabase project URL and anon key are correct</p>
              <p><strong>3.</strong> Check if your Supabase project is active and not paused</p>
              <p><strong>4.</strong> Ensure the `dryer_data` table exists in your database</p>
              <p><strong>5.</strong> Check Row Level Security (RLS) policies on your tables</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
