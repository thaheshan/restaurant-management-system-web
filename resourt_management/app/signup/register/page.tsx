'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, UserCircle, Store, Briefcase, KeyRound, ChevronRight, ChevronLeft, UtensilsCrossed } from 'lucide-react'
import '../Signup.scss'

function RegisterWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flow = searchParams.get('flow') || 'owner' // 'owner' | 'staff'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // State for Wizard Data
  const [role, setRole] = useState(flow === 'owner' ? 'admin' : '') // Staff will select this in Step 1
  const [accountData, setAccountData] = useState({ name: '', email: '', mobile: '', password: '' })
  const [restaurantData, setRestaurantData] = useState({ restaurantName: '', address: '', contact: '', inviteCode: '' })

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      
      // Note: The current backend only supports name, email, mobile, password, and role.
      // The restaurant specific fields are captured in UI but will need a backend update to process.
      const payload = {
        ...accountData,
        role: role
      }

      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Registration failed')

      if (data.token) {
        localStorage.setItem('adminSession', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.user))
      }

      router.push('/admin/login?registered=true')

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // ==== STEP RENDERERS ====

  const renderStepIndicator = () => {
    const totalSteps = flow === 'staff' ? 4 : 3
    const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1)
    
    return (
      <div className="wizard-steps">
        {stepsArray.map((num, i) => (
          <React.Fragment key={num}>
            <div className={`w-step ${step >= num ? 'active' : ''}`}>{num}</div>
            {i < totalSteps - 1 && (
              <div className={`w-line ${step >= num + 1 ? 'active' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderStaffRoleSelection = () => (
    <div className="step-content">
      <h2>Step 1: Choose Your Role</h2>
      <p className="step-desc">Select your primary role within the resort.</p>
      
      <div className="role-options-vertical">
        <div className={`role-option-card ${role === 'manager' ? 'selected' : ''}`} onClick={() => setRole('manager')}>
          <Briefcase size={24} className="ro-icon" />
          <div className="ro-text">
            <h4>Manager</h4>
            <span>Oversee resort operations</span>
          </div>
        </div>
        <div className={`role-option-card ${role === 'chef' ? 'selected' : ''}`} onClick={() => setRole('chef')}>
          <UtensilsCrossed size={24} className="ro-icon" />
          <div className="ro-text">
            <h4>Chef</h4>
            <span>Manage kitchen & menu</span>
          </div>
        </div>
        <div className={`role-option-card ${role === 'staff' ? 'selected' : ''}`} onClick={() => setRole('staff')}>
          <UserCircle size={24} className="ro-icon" />
          <div className="ro-text">
            <h4>Service Staff</h4>
            <span>Handle customer orders</span>
          </div>
        </div>
      </div>
      
      <button className="btn-next" onClick={handleNext} disabled={!role}>
        Continue <ChevronRight size={18} />
      </button>
    </div>
  )

  const renderAccountDetails = () => (
    <div className="step-content">
      <h2>{flow === 'owner' ? 'Step 1' : 'Step 2'}: Account Details</h2>
      <p className="step-desc">Create your personal login credentials.</p>
      
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" value={accountData.name} onChange={e => setAccountData({...accountData, name: e.target.value})} placeholder="John Doe" />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" value={accountData.email} onChange={e => setAccountData({...accountData, email: e.target.value})} placeholder="john@example.com" />
      </div>
      <div className="form-group">
        <label>Mobile Number</label>
        <input type="tel" value={accountData.mobile} onChange={e => setAccountData({...accountData, mobile: e.target.value})} placeholder="+1234567890" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={accountData.password} onChange={e => setAccountData({...accountData, password: e.target.value})} placeholder="••••••••" />
      </div>

      <div className="step-actions">
        {step > 1 && <button className="btn-back" onClick={handleBack}><ChevronLeft size={18} /> Back</button>}
        <button className="btn-next" onClick={handleNext} disabled={!accountData.name || !accountData.email || accountData.password.length < 6}>
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )

  const renderRestaurantDetails = () => (
    <div className="step-content">
      <h2>Step 2: Resort Details</h2>
      <p className="step-desc">Tell us about your resort/restaurant.</p>
      
      <div className="form-group">
        <label>Resort Name</label>
        <input type="text" value={restaurantData.restaurantName} onChange={e => setRestaurantData({...restaurantData, restaurantName: e.target.value})} placeholder="Futura Paradise" />
      </div>
      <div className="form-group">
        <label>Business Address</label>
        <input type="text" value={restaurantData.address} onChange={e => setRestaurantData({...restaurantData, address: e.target.value})} placeholder="123 Ocean Drive" />
      </div>

      <div className="step-actions">
        <button className="btn-back" onClick={handleBack}><ChevronLeft size={18} /> Back</button>
        <button className="btn-next" onClick={handleNext} disabled={!restaurantData.restaurantName}>
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )

  const renderLinkRestaurant = () => (
    <div className="step-content">
      <h2>Step 3: Link to Resort</h2>
      <p className="step-desc">Enter the invite code provided by your manager.</p>
      
      <div className="form-group">
        <label>Invite Code or Resort ID</label>
        <input type="text" value={restaurantData.inviteCode} onChange={e => setRestaurantData({...restaurantData, inviteCode: e.target.value})} placeholder="e.g. RES-9942" />
      </div>

      <div className="step-actions">
        <button className="btn-back" onClick={handleBack}><ChevronLeft size={18} /> Back</button>
        <button className="btn-next" onClick={handleNext}>
          Review Details <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )

  const renderConfirmation = () => (
    <div className="step-content">
      <div className="confirm-icon"><CheckCircle2 size={48} color="#27ae60" /></div>
      <h2 style={{textAlign: 'center'}}>Ready to Join?</h2>
      <p className="step-desc" style={{textAlign: 'center'}}>Review your details before creating your account.</p>
      
      <div className="summary-box">
        <div className="s-row"><span>Role:</span> <strong>{role.toUpperCase()}</strong></div>
        <div className="s-row"><span>Name:</span> <strong>{accountData.name}</strong></div>
        <div className="s-row"><span>Email:</span> <strong>{accountData.email}</strong></div>
        {flow === 'owner' && <div className="s-row"><span>Resort:</span> <strong>{restaurantData.restaurantName}</strong></div>}
        {flow === 'staff' && restaurantData.inviteCode && <div className="s-row"><span>Invite Code:</span> <strong>{restaurantData.inviteCode}</strong></div>}
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="step-actions">
        <button className="btn-back" onClick={handleBack} disabled={loading}><ChevronLeft size={18} /> Back</button>
        <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="signup-page">
      <nav className="signup-nav">
        <div className="brand" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <img src="/futura_logo.png" alt="Futura Resorts" className="nav-logo-img" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
          <span className="brand-text">Futura Resorts</span>
        </div>
        {step === 1 && (
          <button className="nav-back" onClick={() => router.push('/signup/role-selection')}>
            ← Back
          </button>
        )}
      </nav>

      <div className="signup-content">
        <div className="signup-heading">
          <h1>{flow === 'owner' ? 'Register Your Resort' : 'Join as Staff'}</h1>
          <p>Complete the steps below to get started</p>
        </div>

        <div className="wizard-card">
          {renderStepIndicator()}

          {flow === 'staff' && step === 1 && renderStaffRoleSelection()}
          {flow === 'staff' && step === 2 && renderAccountDetails()}
          {flow === 'staff' && step === 3 && renderLinkRestaurant()}
          {flow === 'staff' && step === 4 && renderConfirmation()}

          {flow === 'owner' && step === 1 && renderAccountDetails()}
          {flow === 'owner' && step === 2 && renderRestaurantDetails()}
          {flow === 'owner' && step === 3 && renderConfirmation()}
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="signup-page"><div className="signup-header"><p>Loading...</p></div></div>}>
      <RegisterWizard />
    </Suspense>
  )
}
