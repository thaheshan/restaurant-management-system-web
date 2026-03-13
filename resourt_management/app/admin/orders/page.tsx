'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockOrders } from '@/lib/data/adminMockData'
import { ChevronDown } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const updateOrderStatus = (orderId: string) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const statusSequence = ['placed', 'prep', 'in-progress', 'served']
          const currentIndex = statusSequence.indexOf(order.status as any)
          const nextStatus = statusSequence[(currentIndex + 1) % statusSequence.length]
          return { ...order, status: nextStatus as any }
        }
        return order
      })
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'prep':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'served':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">Real-time order tracking and status updates</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            {/* Order Header */}
            <div
              className="p-6 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100"
              onClick={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
            >
              <div className="flex items-center gap-6 flex-1">
                <div>
                  <p className="font-bold text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">Table {order.tableNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <p className="font-medium text-gray-900">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-medium text-gray-900">Rs. {order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Time</p>
                  <p className="font-medium text-gray-900">{order.estimatedTime} min</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(order.status)} border`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <ChevronDown
                  size={20}
                  className={`text-gray-600 transition ${
                    expandedOrder === order.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {/* Order Details (Expanded) */}
            {expandedOrder === order.id && (
              <div className="p-6 border-t border-gray-200 space-y-6">
                {/* Order Items */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">Rs. {item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Timeline */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Order Timeline</h3>
                  <div className="space-y-3">
                    {['placed', 'prep', 'in-progress', 'served'].map((status, idx) => {
                      const isActive =
                        ['placed', 'prep', 'in-progress', 'served'].indexOf(order.status as any) >=
                        idx
                      return (
                        <div key={status} className="flex items-center gap-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isActive ? 'bg-[#2B7C4F]' : 'bg-gray-300'
                            }`}
                          ></div>
                          <span
                            className={`capitalize ${
                              isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                            }`}
                          >
                            {status.replace('-', ' ')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Update Status */}
                {order.status !== 'served' && (
                  <Button
                    onClick={() => updateOrderStatus(order.id)}
                    className="w-full bg-[#2B7C4F] hover:bg-[#1f5a39] text-white font-medium"
                  >
                    Update Status
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
