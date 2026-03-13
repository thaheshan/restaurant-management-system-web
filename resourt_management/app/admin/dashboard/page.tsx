'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import { mockRestaurantStats, mockOrders, mockCertifications, mockSanitizationLogs } from '@/lib/data/adminMockData'

export default function AdminDashboardPage() {
  const stats = mockRestaurantStats
  const orders = mockOrders.slice(0, 3)
  const certifications = mockCertifications
  const sanitizationLogs = mockSanitizationLogs.slice(0, 3)

  const statCards = [
    {
      label: 'Total Orders Today',
      value: stats.totalOrders,
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Items in Stock',
      value: stats.ingredientsInStock,
      icon: Package,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Expiring Items',
      value: stats.expiringItems,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your restaurant overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certifications */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Food Safety Certifications</h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{cert.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{cert.level}</p>
                    <div className="flex gap-4 mt-3 text-xs">
                      <span className="text-gray-600">
                        <strong>Issue Date:</strong> {cert.issueDate}
                      </span>
                      <span className="text-green-600 font-medium">
                        <strong>Expires:</strong> {cert.expiryDate}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-600 text-white rounded-lg">
                    <CheckCircle size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">Table {order.tableNumber}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    order.status === 'placed'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : order.status === 'prep'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : order.status === 'in-progress'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sanitization Log */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Sanitization Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                <th className="text-left py-3 px-4">Session Type</th>
                <th className="text-left py-3 px-4">Employee</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sanitizationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-900 font-medium">
                        {log.sessionType === 'surface_prep'
                          ? 'Surface Prep'
                          : log.sessionType === 'deep_clean'
                            ? 'Deep Clean'
                            : 'Tables Clean'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{log.employee}</td>
                  <td className="py-3 px-4 text-gray-600">{log.date}</td>
                  <td className="py-3 px-4 text-gray-600">{log.time}</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
