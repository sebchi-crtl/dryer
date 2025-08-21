'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { admin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!admin) {
        router.push('/login')
      } else if (requireAdmin && !admin) {
        router.push('/login?error=admin_required')
      }
    }
  }, [admin, loading, requireAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#DFCFF7] to-[#925FE2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null // Will redirect to login
  }

  if (requireAdmin && !admin) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
