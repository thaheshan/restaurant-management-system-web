'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your restaurant settings</p>
      </div>

      {/* Restaurant Information */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Restaurant Information</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 font-medium">Restaurant Name</Label>
            <Input
              placeholder="DineSmart Restaurant"
              className="mt-2 bg-gray-50"
              defaultValue="DineSmart Restaurant"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Email</Label>
            <Input
              type="email"
              placeholder="admin@dinesmart.com"
              className="mt-2 bg-gray-50"
              defaultValue="admin@dinesmart.com"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Phone</Label>
            <Input
              placeholder="+91-XXXXXXXXXX"
              className="mt-2 bg-gray-50"
              defaultValue="+91-9876543210"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Address</Label>
            <Input
              placeholder="Restaurant Address"
              className="mt-2 bg-gray-50"
              defaultValue="123 Food Street, Restaurant City"
            />
          </div>

          <Button className="bg-[#2B7C4F] hover:bg-[#1f5a39] text-white">Save Changes</Button>
        </div>
      </Card>

      {/* Account Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 font-medium">Current Password</Label>
            <Input type="password" className="mt-2 bg-gray-50" />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">New Password</Label>
            <Input type="password" className="mt-2 bg-gray-50" />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Confirm Password</Label>
            <Input type="password" className="mt-2 bg-gray-50" />
          </div>

          <Button className="bg-[#2B7C4F] hover:bg-[#1f5a39] text-white">Update Password</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Order Alerts</p>
              <p className="text-sm text-gray-600">Get notified for new orders</p>
            </div>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Expiry Alerts</p>
              <p className="text-sm text-gray-600">Get notified for expiring items</p>
            </div>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Compliance Alerts</p>
              <p className="text-sm text-gray-600">Get notified for compliance issues</p>
            </div>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  )
}
