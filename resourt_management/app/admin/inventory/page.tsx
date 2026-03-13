'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockIngredients } from '@/lib/data/adminMockData'
import { Package, AlertTriangle, CheckCircle } from 'lucide-react'

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState(mockIngredients)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ['MEAT', 'SEAFOOD', 'VEGETABLE', 'SPICE']
  const filteredIngredients = selectedCategory
    ? ingredients.filter((ing) => ing.category === selectedCategory)
    : ingredients

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FRESH':
        return <CheckCircle className="text-green-600" size={20} />
      case 'WARNING':
        return <AlertTriangle className="text-orange-600" size={20} />
      case 'EXPIRED':
        return <AlertTriangle className="text-red-600" size={20} />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FRESH':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'WARNING':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'EXPIRED':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const stats = {
    total: ingredients.length,
    fresh: ingredients.filter((i) => i.status === 'FRESH').length,
    warning: ingredients.filter((i) => i.status === 'WARNING').length,
    expired: ingredients.filter((i) => i.status === 'EXPIRED').length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all ingredients</p>
        </div>
        <Button className="bg-[#2B7C4F] hover:bg-[#1f5a39] text-white">
          + Add Ingredient
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm">Total Items</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50">
          <p className="text-green-700 text-sm font-medium">Fresh</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.fresh}</p>
        </Card>
        <Card className="p-4 border-orange-200 bg-orange-50">
          <p className="text-orange-700 text-sm font-medium">Warning</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{stats.warning}</p>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-700 text-sm font-medium">Expired</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.expired}</p>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        <Button
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className={selectedCategory === null ? 'bg-[#2B7C4F] text-white' : ''}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className={selectedCategory === cat ? 'bg-[#2B7C4F] text-white' : ''}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Inventory Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                <th className="text-left py-4 px-6">Ingredient</th>
                <th className="text-left py-4 px-6">Category</th>
                <th className="text-left py-4 px-6">Stock</th>
                <th className="text-left py-4 px-6">Expiry Date</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIngredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Package size={16} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{ingredient.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{ingredient.category}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#2B7C4F] h-2 rounded-full"
                          style={{ width: `${Math.min((ingredient.quantity / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{ingredient.expiryDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ingredient.status)}
                      <Badge className={`${getStatusColor(ingredient.status)} border`}>
                        {ingredient.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      Edit
                    </Button>
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
