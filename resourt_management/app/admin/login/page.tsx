'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Mock authentication
    setTimeout(() => {
      if (email === 'admin@dinesmart.com' && password === 'admin123') {
        // Store admin session
        localStorage.setItem(
          'adminSession',
          JSON.stringify({
            id: 'admin-001',
            email,
            name: 'Chef Michael',
            restaurantId: 'rest-001',
          })
        )
        router.push('/admin/dashboard')
      } else {
        setError('Invalid email or password')
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-100 to-slate-50 items-center justify-center p-8">
        <div className="relative w-full h-full max-w-md">
          <Image
            src="https://images.unsplash.com/photo-1504674900566-b56cad100050?w=500&h=600&fit=crop"
            alt="Restaurant kitchen"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">DineSmart</h1>
            <p className="text-gray-600">Welcome back, Admin!</p>
          </div>

          {/* Login Card */}
          <Card className="p-8 border-gray-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-gray-50 border-gray-200"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 bg-gray-50 border-gray-200"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2B7C4F] hover:bg-[#1f5a39] text-white font-semibold py-2 rounded-lg"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>

              {/* Demo credentials hint */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-1">Demo Credentials:</p>
                <p className="text-xs text-blue-700">Email: admin@dinesmart.com</p>
                <p className="text-xs text-blue-700">Password: admin123</p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
