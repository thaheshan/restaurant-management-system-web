'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import '../Marketing.scss'

export function MarketingNav() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="marketing-nav">
      <div className="brand" onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/futura_logo.png" alt="Futura Resorts" className="nav-logo-img" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
        <span className="brand-text">Futura Resorts</span>
      </div>
      <div className="nav-actions">
        {mounted && (
          <button 
            className="btn-theme-toggle" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Theme"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--hub-text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background 0.3s'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
        <button className="btn-ghost" onClick={() => router.push('/admin/login')}>Log In</button>
        <button className="btn-primary" onClick={() => router.push('/signup/role-selection')}>Sign Up Free</button>
      </div>
    </nav>
  )
}
