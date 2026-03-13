'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockIngredients } from '@/lib/data/adminMockData'
import { AlertTriangle, ChefHat } from 'lucide-react'

export default function ExpiryAlertsPage() {
  const expiringItems = mockIngredients.filter(
    (ing) => ing.status === 'WARNING' || ing.status === 'EXPIRED'
  )

  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expiry Alerts</h1>
        <p className="text-gray-600 mt-1">
          Manage ingredients that are expiring soon or have already expired
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-2 border-orange-200 bg-orange-50">
          <p className="text-orange-700 text-sm font-medium">Items Expiring Soon</p>
          <p className="text-3xl font-bold text-orange-900 mt-1">
            {mockIngredients.filter((i) => i.status === 'WARNING').length}
          </p>
        </Card>
        <Card className="p-4 border-2 border-red-200 bg-red-50">
          <p className="text-red-700 text-sm font-medium">Expired Items</p>
          <p className="text-3xl font-bold text-red-900 mt-1">
            {mockIngredients.filter((i) => i.status === 'EXPIRED').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Action Required</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{expiringItems.length}</p>
        </Card>
      </div>

      {/* Expiring Items */}
      <div className="space-y-3">
        {expiringItems.map((item) => (
          <Card
            key={item.id}
            className={`p-4 cursor-pointer transition ${
              selectedItem === item.id ? 'ring-2 ring-[#2B7C4F]' : ''
            } ${item.status === 'EXPIRED' ? 'border-2 border-red-200 bg-red-50' : 'border-2 border-orange-200 bg-orange-50'}`}
            onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle
                    className={item.status === 'EXPIRED' ? 'text-red-600' : 'text-orange-600'}
                    size={24}
                  />
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <Badge
                    className={`${
                      item.status === 'EXPIRED'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : 'bg-orange-100 text-orange-700 border-orange-300'
                    } border`}
                  >
                    {item.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">CATEGORY</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">QUANTITY</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">EXPIRY ON</p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        item.status === 'EXPIRED' ? 'text-red-700' : 'text-orange-700'
                      }`}
                    >
                      {item.expiryDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">ACTION</p>
                    <Button
                      size="sm"
                      className="mt-1 bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <ChefHat size={14} className="mr-1" />
                      Create Dish
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedItem === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-300 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Suggested Actions:
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>
                          • Create a special dish using {item.name} to reduce inventory
                        </li>
                        <li>• Offer discounted items featuring {item.name}</li>
                        <li>• Donate to local food banks if applicable</li>
                        <li>• Remove from inventory if expired</li>
                      </ul>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Mark as Disposed
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {expiringItems.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600 text-lg">No expiring items at the moment!</p>
        </Card>
      )}
    </div>
  )
}
