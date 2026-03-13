'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Check,
  AlertTriangle,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminUser {
  id: string
  email: string
  name: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin/login')
      return
    }
    setAdmin(JSON.parse(session))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Orders', icon: ClipboardList, href: '/admin/orders' },
    { label: 'Inventory', icon: Package, href: '/admin/inventory' },
    { label: 'Hygiene', icon: Check, href: '/admin/hygiene' },
    { label: 'Expiry Alerts', icon: AlertTriangle, href: '/admin/expiry-alerts' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  if (!admin) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2B7C4F] text-white flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-green-600">
          <h1 className="text-2xl font-bold">DineSmart</h1>
          <p className="text-sm text-green-100 mt-1">Admin Dashboard</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-green-100 hover:bg-green-600'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-green-600 space-y-3">
          <div className="px-4 py-3 bg-green-600 rounded-lg">
            <p className="text-sm font-medium">{admin.name}</p>
            <p className="text-xs text-green-100">{admin.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-green-700 border-green-200 hover:bg-green-50"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold text-gray-900">DineSmart</h1>
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="ghost"
            size="sm"
          >
            ☰
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#2B7C4F] text-white p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-green-600'
                      : 'text-green-100 hover:bg-green-600'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full mt-4"
            >
              Logout
            </Button>
          </div>
        )}

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
