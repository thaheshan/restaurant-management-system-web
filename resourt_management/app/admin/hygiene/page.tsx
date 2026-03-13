'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockCertifications, mockSanitizationLogs } from '@/lib/data/adminMockData'
import { CheckCircle, AlertCircle, Plus } from 'lucide-react'

export default function HygienePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hygiene & Compliance</h1>
          <p className="text-gray-600 mt-1">Monitor food safety and sanitization records</p>
        </div>
        <Button className="bg-[#2B7C4F] hover:bg-[#1f5a39] text-white">
          <Plus size={16} className="mr-2" />
          Log Sanitization
        </Button>
      </div>

      {/* Certifications */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Food Safety Certifications</h2>
        <div className="space-y-4">
          {mockCertifications.map((cert) => (
            <Card key={cert.id} className="p-6 border-2 border-green-200 bg-green-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="text-green-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">{cert.name}</h3>
                    <Badge className="bg-green-600 text-white">OFFICIAL APPROVED SEAL</Badge>
                  </div>
                  <p className="text-gray-700 font-medium mt-3">{cert.level}</p>

                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <p className="text-xs uppercase text-gray-600 font-semibold tracking-wide">
                        Issue Date
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">{cert.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-600 font-semibold tracking-wide">
                        Expires
                      </p>
                      <p className="text-lg font-medium text-green-600 mt-1">{cert.expiryDate}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-600 rounded-lg">
                  <CheckCircle className="text-white" size={48} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sanitization Log */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Sanitization Log</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                  <th className="text-left py-4 px-6">Session Type</th>
                  <th className="text-left py-4 px-6">Employee</th>
                  <th className="text-left py-4 px-6">Date</th>
                  <th className="text-left py-4 px-6">Time</th>
                  <th className="text-left py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockSanitizationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        <span className="font-medium text-gray-900">
                          {log.sessionType === 'surface_prep'
                            ? 'Surface Prep'
                            : log.sessionType === 'deep_clean'
                              ? 'Deep Clean'
                              : 'Tables Clean'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{log.employee}</td>
                    <td className="py-4 px-6 text-gray-600">{log.date}</td>
                    <td className="py-4 px-6 text-gray-600">{log.time}</td>
                    <td className="py-4 px-6">
                      <Badge className="bg-green-50 text-green-700 border border-green-200">
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

      {/* Compliance Status */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-green-600" size={32} />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Compliance Status</h3>
            <p className="text-gray-600 mt-1">All hygiene standards are being maintained.</p>
            <p className="text-sm text-gray-500 mt-3">Last checked: Today at 12:30 PM</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
