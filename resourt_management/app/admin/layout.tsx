'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout/MainDashboard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin/login')
    } else {
      setAuthenticated(true)
    }
  }, [router])

  if (!mounted) return <>{children}</>
  if (pathname === '/admin/login') return <>{children}</>
  if (!authenticated) return null

  // ✅ Just wrap children — no title here
  return <DashboardLayout title="">{children}</DashboardLayout>
}