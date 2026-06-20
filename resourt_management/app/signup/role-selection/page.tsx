'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Store, Users, ChevronRight, ArrowLeft } from 'lucide-react'
import '../Signup.scss'

export default function RoleSelectionPage() {
  const router = useRouter()

  const handleSelectRole = (role: 'admin' | 'staff') => {
    if (role === 'admin') {
      router.push('/signup/register?flow=owner')
    } else {
      router.push('/signup/register?flow=staff')
    }
  }

  return (
    <div className="signup-page">
      {/* ── Nav ── */}
      <nav className="signup-nav">
        <div className="brand" onClick={() => router.push('/')}>
          <img
            src="/futura_logo.png"
            alt="Futura Resorts"
            className="nav-logo-img"
            style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
          />
          <span className="brand-text">Futura Resorts</span>
        </div>
        <button className="nav-back" onClick={() => router.push('/marketing')}>
          <ArrowLeft size={14} />
          Back to Home
        </button>
      </nav>

      {/* ── Content ── */}
      <div className="signup-content">
        <div className="signup-heading">
          <h1>Join Futura Resorts</h1>
          <p>How do you plan to use the platform?</p>
        </div>

        {/* ── Role Cards ── */}
        <div className="role-grid">
          {/* Owner Card */}
          <div className="role-card" onClick={() => handleSelectRole('admin')}>
            <span className="role-badge">Full Access</span>
            <div className="role-icon">
              <Store size={34} color="#1e6e4e" />
            </div>
            <h2>Shop Owner</h2>
            <p>Register your resort or restaurant and manage everything from bookings to inventory.</p>
            <div className="role-cta">
              Get Started <ChevronRight size={14} />
            </div>
          </div>

          {/* Staff Card */}
          <div className="role-card" onClick={() => handleSelectRole('staff')}>
            <span className="role-badge">Team Access</span>
            <div className="role-icon">
              <Users size={34} color="#1e6e4e" />
            </div>
            <h2>Staff Member</h2>
            <p>Join an existing resort as a manager, chef, or service staff member on the platform.</p>
            <div className="role-cta">
              Get Started <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <p className="signup-footer-link">
          Already have an account?{' '}
          <span onClick={() => router.push('/admin/login')}>Log In</span>
        </p>
      </div>
    </div>
  )
}
