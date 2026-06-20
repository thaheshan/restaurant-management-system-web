'use client'

import React, { useState } from 'react'
import { 
  Users, Utensils, ClipboardList, Receipt, BarChart3, CalendarDays,
  Shield, Check, ArrowRight, HelpCircle, Mail, Phone, MapPin, 
  Database, Server, ShieldCheck, Lock, Award, Activity, Globe
} from 'lucide-react'
import '../Marketing.scss'

export function ResortFeatures() {
  const features = [
    {
      icon: <Users size={32} className="feat-icon" />,
      title: "Guest & Table Management",
      desc: "Build detailed customer profiles, manage table seating, and track guest preferences seamlessly.",
      bullets: ["Add customers", "Track dining history", "SMS notifications"]
    },
    {
      icon: <Utensils size={32} className="feat-icon" />,
      title: "Order & Kitchen Tracking",
      desc: "Track orders through every stage (Pending, Preparing, Ready, Served, Delivered) with ease.",
      bullets: ["Status updates", "Kitchen display support", "Time tracking"]
    },
    {
      icon: <ClipboardList size={32} className="feat-icon" />,
      title: "Inventory Control",
      desc: "Keep track of your ingredients, accessories, and products in real-time.",
      bullets: ["Low stock alerts", "Vendor management", "Expiry date tracking"]
    },
    {
      icon: <Receipt size={32} className="feat-icon" />,
      title: "POS & Billing",
      desc: "Process transactions quickly, create detailed invoices, and manage payments.",
      bullets: ["Tax calculation", "Custom receipts", "Email/SMS invoices"]
    },
    {
      icon: <BarChart3 size={32} className="feat-icon" />,
      title: "Analytics & Reports",
      desc: "Make data-driven decisions with comprehensive performance insights.",
      bullets: ["Revenue tracking", "Employee performance", "Popular dishes"]
    },
    {
      icon: <CalendarDays size={32} className="feat-icon" />,
      title: "Booking System",
      desc: "Let customers book dining appointments and tables online automatically.",
      bullets: ["Online booking", "Automated reminders", "Calendar sync"]
    }
  ]

  return (
    <section className="marketing-section features-section">
      <div className="section-header">
        <h2 className="section-title">Powerful Features Built for Modern Resorts</h2>
        <p className="section-subtitle">Everything you need to run your resort and restaurant business efficiently and profitably.</p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="icon-wrapper">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <ul className="bullet-list">
              {f.bullets.map((b, idx) => (
                <li key={idx}><Check size={14} className="bullet-check" /> {b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Register Resort",
      desc: "Create an account and set up your resort/restaurant details in minutes."
    },
    {
      step: "2",
      title: "Add Services & Menu",
      desc: "Define your menu items, pricing, and initial inventory categories."
    },
    {
      step: "3",
      title: "Create First Order",
      desc: "Log guest dining orders and track their cooking status in the kitchen."
    },
    {
      step: "4",
      title: "Manage & Grow",
      desc: "Track real-time analytics, manage kitchen staff, and scale your business."
    }
  ]

  return (
    <section className="marketing-section how-it-works-section">
      <div className="section-header">
        <h2 className="section-title">How Futura Resorts Works in 4 Simple Steps</h2>
        <p className="section-subtitle">From setting up your business to managing daily operations, it's that easy.</p>
      </div>

      <div className="steps-container">
        {steps.map((s, i) => (
          <div key={i} className="step-card">
            <div className="step-number">{s.step}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  // Monthly: Starter Rs. 3,500 | Pro Rs. 6,500 (LKR)
  // Yearly (20% off, billed annually):
  //   Starter: 3,500 × 12 × 0.8 = 33,600 → Rs. 2,800/mo
  //   Pro:     6,500 × 12 × 0.8 = 62,400 → Rs. 5,200/mo
  const plans = [
    {
      name: "Starter",
      monthlyPrice: 'Rs. 3,500',
      yearlyMonthly: 'Rs. 2,800',
      yearlyTotal: 'Rs. 33,600',
      yearlySaving: 'Rs. 8,400',
      desc: "Essential features for small boutique resorts.",
      features: [
        "Up to 5 staff accounts",
        "Standard order tracking",
        "Basic POS billing",
        "Email support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro Business",
      monthlyPrice: 'Rs. 6,500',
      yearlyMonthly: 'Rs. 5,200',
      yearlyTotal: 'Rs. 62,400',
      yearlySaving: 'Rs. 15,600',
      desc: "Complete management solution for busy resort kitchens.",
      features: [
        "Unlimited staff accounts",
        "Real-time Inventory alerts",
        "Advanced kitchen display analytics",
        "Priority 24/7 chat support",
        "Customer loyalty system"
      ],
      cta: "Start 14-Day Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      monthlyPrice: 'Custom',
      yearlyMonthly: 'Custom',
      yearlyTotal: '',
      yearlySaving: '',
      desc: "For large scale hotel chains and luxury multi-branch resorts.",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Custom integration & API access",
        "Dedicated Account Manager",
        "99.9% Uptime SLA",
        "White-labeling option",
        "24/7 Phone Support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <section className="marketing-section pricing-section">
      <div className="section-header">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="section-subtitle">Choose the perfect plan for your resort operations.</p>
        
        <div className="billing-selector">
          <button 
            className={`billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`billing-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="save-badge">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {plans.map((p, i) => {
          const displayPrice = billingCycle === 'monthly' ? p.monthlyPrice : p.yearlyMonthly
          const isCustom = displayPrice === 'Custom'
          return (
            <div key={i} className={`pricing-card ${p.popular ? 'popular' : ''}`}>
              {p.popular && <span className="popular-badge">Most Popular</span>}
              <h3>{p.name}</h3>
              <div className="price-display">
                <span className="price-num">{displayPrice}</span>
                {!isCustom && <span className="price-period">/ month</span>}
              </div>
              {!isCustom && billingCycle === 'yearly' && (
                <p className="yearly-total">
                  Billed as <strong>{p.yearlyTotal}/yr</strong> · saves <strong>{p.yearlySaving}</strong>
                </p>
              )}
              {!isCustom && billingCycle === 'monthly' && (
                <p className="yearly-nudge">Switch to yearly &amp; save 20%</p>
              )}
              <p className="plan-desc">{p.desc}</p>
              <hr className="plan-divider" />
              <ul className="plan-features">
                {p.features.map((f, idx) => (
                  <li key={idx}><Check size={16} className="plan-check" /> {f}</li>
                ))}
              </ul>
              <button className={`plan-cta-btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                {p.cta}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function SecuritySection() {
  const securityPoints = [
    {
      icon: <Lock size={24} />,
      title: "AES-256 Encryption Standard",
      desc: "End-to-end encryption for all sensitive user credentials and transaction data."
    },
    {
      icon: <Award size={24} />,
      title: "ISO Certified Compliant",
      desc: "Strictly adhere to international information security standards and best practices."
    },
    {
      icon: <Activity size={24} />,
      title: "99.9% Reliable Performance",
      desc: "High-availability clustering guarantees your kitchen and front-desk are always operational."
    },
    {
      icon: <Globe size={24} />,
      title: "GDPR Ready",
      desc: "Rigorous personal data privacy protection measures built into every component."
    }
  ]

  return (
    <section className="marketing-section security-section">
      <div className="security-container">
        <div className="security-text-content">
          <div className="badge">SECURITY FIRST</div>
          <h2>Enterprise-Grade Security</h2>
          <p>Your data is our top priority. We employ industry-leading security measures to keep your resort operations and guest information completely safe.</p>
          <ul className="security-details-list">
            <li><Check size={18} className="bullet-check" /> End-to-end encryption for all sensitive data</li>
            <li><Check size={18} className="bullet-check" /> 24/7 continuous monitoring and threat detection</li>
            <li><Check size={18} className="bullet-check" /> Daily automated backups stored securely offsite</li>
            <li><Check size={18} className="bullet-check" /> Role-based access controls and audit logging</li>
          </ul>
        </div>

        <div className="security-features-grid">
          {securityPoints.map((sp, i) => (
            <div key={i} className="security-point-card">
              <div className="sp-icon-box">{sp.icon}</div>
              <h4>{sp.title}</h4>
              <p>{sp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const faqs = [
    {
      q: "Do I need technical skills to use Futura Resorts?",
      a: "No, Futura Resorts is designed to be intuitive and user-friendly. You can set up your complete resort and restaurant operations without any technical knowledge."
    },
    {
      q: "Is there a free trial available?",
      a: "Yes, we offer a 14-day free trial on all plans. Get full access to all features with no credit card required."
    },
    {
      q: "Can I integrate Futura Resorts with other tools?",
      a: "Yes, Futura Resorts offers seamless integrations with popular accounting software, payment gateways, and hotel booking channels to streamline your workflows."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Absolutely. There are no long-term contracts or lock-in periods. You can downgrade, upgrade, or cancel your subscription at any time."
    },
    {
      q: "Do you offer customer support?",
      a: "Yes! Our dedicated support team is available via chat and email to help you with any questions or technical issues you might encounter."
    }
  ]

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="marketing-section faq-section">
      <div className="section-header">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Find answers to common questions about Futura Resorts.</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className={`faq-item ${activeIndex === i ? 'active' : ''}`}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          >
            <div className="faq-question">
              <h4>{faq.q}</h4>
              <span className="faq-toggle-icon">{activeIndex === i ? '-' : '+'}</span>
            </div>
            {activeIndex === i && (
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <section className="marketing-section contact-section">
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have questions about Futura Resorts? We're here to help you optimize your resort operations.</p>
          
          <div className="contact-method">
            <Mail className="cm-icon" size={24} />
            <div className="cm-text">
              <h4>Email Us</h4>
              <span>info@futuraresorts.space</span>
            </div>
          </div>

          <div className="contact-method">
            <Phone className="cm-icon" size={24} />
            <div className="cm-text">
              <h4>Call Us</h4>
              <span>+94 075 664 5486</span>
              <span>+94 076 969 6083</span>
            </div>
          </div>

          <div className="contact-method">
            <MapPin className="cm-icon" size={24} />
            <div className="cm-text">
              <h4>Visit Us</h4>
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="John Doe" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="john@example.com" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
                placeholder="How can we help?" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
                placeholder="Tell us about your needs..." 
                rows={4} 
                required 
              />
            </div>
            <button type="submit" className="btn-submit" disabled={submitted}>
              {submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
