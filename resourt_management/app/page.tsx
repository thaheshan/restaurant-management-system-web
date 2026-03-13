import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Smartphone, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-[#2B7C4F] text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">DineSmart</h1>
            <p className="text-green-100 mt-1">Restaurant Management System</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DineSmart</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A complete restaurant management solution with customer mobile ordering and admin dashboard
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Customer App */}
          <Card className="p-8 hover:shadow-lg transition border-2 border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
                <Smartphone className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Mobile App</h3>
              <p className="text-gray-600 mb-6">
                React Native mobile app for customers to scan QR code, browse menu, order food, and track their orders in real-time
              </p>
              <div className="space-y-2 text-sm text-gray-600 mb-6 text-left">
                <p>✓ QR Code scanning (no login required)</p>
                <p>✓ Browse menu by categories</p>
                <p>✓ Add items to cart</p>
                <p>✓ Multiple payment options</p>
                <p>✓ Real-time order tracking</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-900 font-semibold">Status: Mobile app created with Expo React Native</p>
              </div>
              <Link href="https://github.com" target="_blank">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Mobile App Code
                </Button>
              </Link>
            </div>
          </Card>

          {/* Admin Dashboard */}
          <Card className="p-8 hover:shadow-lg transition border-2 border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4">
                <BarChart3 className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Next.js web admin dashboard for restaurant management with real-time order tracking, inventory, and compliance monitoring
              </p>
              <div className="space-y-2 text-sm text-gray-600 mb-6 text-left">
                <p>✓ Admin authentication</p>
                <p>✓ Real-time order management</p>
                <p>✓ Inventory tracking</p>
                <p>✓ Hygiene & compliance dashboard</p>
                <p>✓ Expiry alerts management</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-900 font-semibold">Demo: admin@dinesmart.com / admin123</p>
              </div>
              <Link href="/admin/login">
                <Button className="w-full bg-[#2B7C4F] hover:bg-[#1f5a39] text-white">
                  Go to Admin Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-lg p-12 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Complete System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Customer Experience</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• No authentication required</li>
                <li>• QR code table identification</li>
                <li>• Digital menu browsing</li>
                <li>• Instant cart management</li>
                <li>• Flexible payment options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Admin Controls</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Secure admin login</li>
                <li>• Order status updates</li>
                <li>• Kitchen display system</li>
                <li>• Staff management</li>
                <li>• Performance analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Restaurant Operations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Inventory management</li>
                <li>• Expiry tracking</li>
                <li>• Hygiene compliance</li>
                <li>• Sanitization logs</li>
                <li>• Food safety certifications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Mobile App (Customer)</h4>
              <div className="space-y-2 text-gray-600">
                <p>• React Native with Expo</p>
                <p>• TypeScript for type safety</p>
                <p>• Expo Router for navigation</p>
                <p>• Context API for state</p>
                <p>• Expo Camera for QR scanning</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Web Admin Dashboard</h4>
              <div className="space-y-2 text-gray-600">
                <p>• Next.js 16 with App Router</p>
                <p>• TypeScript strict mode</p>
                <p>• shadcn/ui components</p>
                <p>• Tailwind CSS v4</p>
                <p>• Mock data services</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2026 DineSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
