'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch } from '@/app/src/store/hooks'
import { setUserFromSession } from '@/app/src/store/slices/authSlice'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin/login')
    } else {
      // Load user into Redux from existing session
      dispatch(setUserFromSession())
      setTimeout(() => setAuthenticated(true), 0)
    }
  }, [router, dispatch])

  if (pathname === '/admin/login') return <>{children}</>
  if (authenticated === null) return null
  if (!authenticated) return null

  return <>{children}</>
}