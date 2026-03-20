'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin/login')
    } else {
      setTimeout(() => setAuthenticated(true), 0)
    }
  }, [router])

  if (pathname === '/admin/login') return <>{children}</>
  if (authenticated === null) return null
  if (!authenticated) return null

  return <>{children}</>
}