'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const testConnection = async () => {
    setStatus('Testing connection...')
    setError('')
    
    try {
      const supabase = createClient()
      
      // Test basic connection
      const { data, error } = await supabase.from('dryer_data').select('count').limit(1)
      
      if (error) {
        setError(`Database error: ${error.message}`)
        setStatus('Connection failed')
      } else {
        setStatus('Connection successful! Database is accessible.')
      }
    } catch (err: any) {
      setError(`Client error: ${err.message}`)
      setStatus('Connection failed')
    }
  }

  const testAuth = async () => {
    setStatus('Testing auth...')
    setError('')
    
    try {
      const supabase = createClient()
      
      // Test auth connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setError(`Auth error: ${error.message}`)
        setStatus('Auth test failed')
      } else {
        setStatus('Auth connection successful!')
      }
    } catch (err: any) {
      setError(`Auth client error: ${err.message}`)
      setStatus('Auth test failed')
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Supabase Connection Test</h3>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={testConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Test Database Connection
          </button>
          <button 
            onClick={testAuth}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Test Auth Connection
          </button>
        </div>
        
        {status && (
          <div className="p-3 bg-gray-100 rounded">
            <strong>Status:</strong> {status}
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Environment Variables:</strong></p>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
      </div>
    </div>
  )
}
