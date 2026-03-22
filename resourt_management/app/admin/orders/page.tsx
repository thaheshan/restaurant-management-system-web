'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout/MainDashboard'

const STATUS_LABELS: Record<string, string> = {
  order_placed: 'Order Placed',
  start_prep: 'Start Prep',
  in_progress: 'In Progress',
  served: 'Served',
}

const STATUS_COLORS: Record<string, string> = {
  order_placed: 'bg-blue-50 text-blue-700 border-blue-200',
  start_prep: 'bg-orange-50 text-orange-700 border-orange-200',
  in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  served: 'bg-green-50 text-green-700 border-green-200',
}

const NEXT_STATUS: Record<string, string> = {
  order_placed: 'start_prep',
  start_prep: 'in_progress',
  in_progress: 'served',
}

const NEXT_LABELS: Record<string, string> = {
  order_placed: 'Start Prep',
  start_prep: 'In Progress',
  in_progress: 'Mark Served',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [restaurantId, setRestaurantId] = useState('')
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    try {
      const session = localStorage.getItem('adminSession')
      if (session) {
        const parsed = JSON.parse(session)
        setRestaurantId(parsed.user?.restaurantId || parsed.restaurantId || '')
        setToken(parsed.token || '')
        setUserId(parsed.user?.id || parsed.userId || '')
      }
    } catch {}
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!restaurantId || !token) return
    try {
      const res = await fetch(
        `http://localhost:8000/api/orders/restaurant/${restaurantId}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-role': 'admin',
            'x-restaurant-id': restaurantId,
          },
        }
      )
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
        setError('')
      } else {
        setError(data.error || 'Failed to fetch orders')
      }
    } catch (err) {
      setError('Failed to fetch orders - check backend is running')
    } finally {
      setLoading(false)
    }
  }, [restaurantId, token, userId])

  useEffect(() => {
    if (restaurantId && token) {
      fetchOrders()
      const interval = setInterval(fetchOrders, 10000)
      return () => clearInterval(interval)
    }
  }, [restaurantId, token, fetchOrders])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(
        `http://localhost:8000/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )
      const data = await res.json()
      if (data.success) {
        fetchOrders()
      } else {
        setError(data.error || 'Failed to update status')
      }
    } catch {
      setError('Network error updating status')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <DashboardLayout title="Orders Management">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-1">Real-time order tracking and status updates</p>
          </div>
          <Button
            onClick={fetchOrders}
            variant="outline"
            className="border-[#2B7C4F] text-[#2B7C4F]"
          >
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="text-5xl mb-4">??</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 text-sm">Orders placed by customers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div
                  className="p-6 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div>
                      <p className="font-bold text-gray-900">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">Table {order.table_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="font-medium text-gray-900">{order.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-medium text-gray-900">Rs. {isNaN(parseFloat(order.grand_total)) ? '0' : isNaN(parseFloat(order.grand_total)) ? '0' : parseFloat(order.grand_total).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`${STATUS_COLORS[order.order_status] || 'bg-gray-50 text-gray-700'} border`}>
                      {STATUS_LABELS[order.order_status] || order.order_status}
                    </Badge>
                    <ChevronDown
                      size={20}
                      className={`text-gray-600 transition ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {(Array.isArray(order.items) ? order.items : []).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Order Timeline</h3>
                      <div className="space-y-3">
                        {['order_placed', 'start_prep', 'in_progress', 'served'].map((status, idx) => {
                          const statuses = ['order_placed', 'start_prep', 'in_progress', 'served']
                          const isActive = statuses.indexOf(order.order_status) >= idx
                          return (
                            <div key={status} className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-[#2B7C4F]' : 'bg-gray-300'}`} />
                              <span className={isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                                {STATUS_LABELS[status]}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {NEXT_STATUS[order.order_status] && (
                      <Button
                        onClick={() => handleUpdateStatus(order.id, NEXT_STATUS[order.order_status])}
                        disabled={updating === order.id}
                        className="w-full bg-[#2B7C4F] hover:bg-[#1f5a39] text-white font-medium"
                      >
                        {updating === order.id ? 'Updating...' : `? Mark as ${NEXT_LABELS[order.order_status]}`}
                      </Button>
                    )}

                    {order.order_status === 'served' && (
                      <div className="text-center py-3 bg-green-50 text-green-700 rounded-lg font-semibold">
                        ? Order Served
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}



