'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import '../Signup.scss'

export default function StaffRolesPage() {
  const router = useRouter()

  const handleSelectRole = (role: 'manager' | 'chef' | 'staff') => {
    router.push(`/signup/register?role=${role}`)
  }

  return (
    <div className="signup-page">
      <div className="signup-header">
        <div className="brand" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">FR</div>
          <span>Futura Resorts</span>
        </div>
        <h1>Select Your Role</h1>
        <p>Choose your specific staff role within the resort.</p>
      </div>

      <div className="role-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="role-card" onClick={() => handleSelectRole('manager')}>
          <div className="role-icon">👔</div>
          <h2>Manager</h2>
          <p>Oversee operations, manage staff, and handle customer relations.</p>
        </div>

        <div className="role-card" onClick={() => handleSelectRole('chef')}>
          <div className="role-icon">🧑‍🍳</div>
          <h2>Chef</h2>
          <p>Manage kitchen orders, update menus, and maintain hygiene standards.</p>
        </div>

        <div className="role-card" onClick={() => handleSelectRole('staff')}>
          <div className="role-icon">🍽️</div>
          <h2>Service Staff</h2>
          <p>Handle table service, take orders, and ensure guest satisfaction.</p>
        </div>
      </div>

      <a className="back-link" onClick={() => router.push('/signup/role-selection')}>
        &larr; Back to Role Selection
      </a>
    </div>
  )
}
