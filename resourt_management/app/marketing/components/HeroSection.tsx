'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import '../Marketing.scss'

export function HeroSection() {
  const router = useRouter()

  return (
    <main className="marketing-hero">
      <div className="hero-content">
        <div className="badge">Built on React & Node.js</div>
        <h1 className="hero-title">
          The Complete <span className="highlight">Restaurant Management</span> System.
        </h1>
        <p className="hero-subtitle">
          A full-stack, dual-frontend solution featuring a Customer Web Application and a secure Admin Dashboard. Seamlessly manage menus, real-time orders, and JWT-authenticated users.
        </p>
        <div className="hero-cta-group">
          <button className="btn-primary-large" onClick={() => router.push('/signup/role-selection')}>
            Get Started Now
          </button>
          <button className="btn-secondary-large" onClick={() => router.push('/admin/login')}>
            Sign In to Dashboard
          </button>
        </div>
      </div>
      
      {/* Abstract Hero Graphic */}
      <div className="hero-graphic">
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {/* Background Kitchen Image covering the entire card */}
          <img 
            src="/kitchen_hero.png" 
            alt="Kitchen Operations Background" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              zIndex: 0,
              opacity: 0.6
            }} 
          />
          {/* Dark Overlay Gradient to ensure text/loader readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(22, 27, 34, 0.4), rgba(22, 27, 34, 0.85))',
            zIndex: 1
          }}></div>

          {/* Loader Overlay Content */}
          <div className="stat-row" style={{ position: 'relative', zIndex: 2 }}>
            <div className="stat-circle"></div>
            <div className="stat-lines">
              <div className="line long" style={{ background: '#ffffff', opacity: 0.9 }}></div>
              <div className="line short" style={{ background: '#ffffff', opacity: 0.6 }}></div>
            </div>
          </div>
        </div>
        <div className="glow-orb"></div>
      </div>
    </main>
  )
}
