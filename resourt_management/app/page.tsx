'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (session) {
      window.location.href = '/admin/dashboard'
    } else {
      window.location.href = '/admin/login'
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #2B7C4F',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Redirecting...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}