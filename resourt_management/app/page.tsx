'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SplashScreen() {
  const router = useRouter()
  const [animateOut, setAnimateOut] = useState(false)

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setAnimateOut(true)
    }, 2500)

    // Redirect to marketing page after 3.2 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/marketing')
    }, 3200)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className={`splash-container ${animateOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img src="/futura_logo.png" alt="Futura Resorts" className="splash-logo-img" style={{ height: '180px', width: 'auto', objectFit: 'contain' }} />
        <h1 className="brand-name">
          <span className="brand-futura">Futura</span>
          <span className="brand-resorts">Resorts</span>
        </h1>
        <div className="loader-line">
          <div className="loader-progress"></div>
        </div>
      </div>

      <style jsx>{`
        .splash-container {
          min-height: 100vh;
          background: url('/splash_bg.png') center/cover no-repeat; /* Updated to use image instead of solid green */
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out;
          opacity: 1;
          transform: scale(1);
          position: relative;
        }
        .splash-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(26, 58, 42, 0.7); /* Dark green overlay to ensure text readability */
          z-index: -1;
        }
        .splash-container.fade-out {
          opacity: 0;
          transform: scale(1.05);
        }
        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .splash-logo-img {
          width: 100px;
          height: 100px;
          object-fit: contain;
          border-radius: 20px;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 8px 32px rgba(39, 174, 96, 0.4));
        }
        .brand-name {
          font-family: 'Sora', sans-serif;
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -1px;
          display: flex;
          gap: 12px;
          margin: 0;
        }
        .brand-futura {
          color: #ffffff;
        }
        .brand-resorts {
          color: #27ae60;
        }
        .loader-line {
          width: 140px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 16px;
        }
        .loader-progress {
          width: 100%;
          height: 100%;
          background: #27ae60;
          border-radius: 4px;
          transform-origin: left;
          animation: loadProgress 2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes loadProgress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}