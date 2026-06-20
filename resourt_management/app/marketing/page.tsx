'use client'

import React from 'react'
import { MarketingNav } from './components/MarketingNav'
import { HeroSection } from './components/HeroSection'
import { TechStackBanner } from './components/TechStackBanner'
import { FeaturesBentoGrid } from './components/FeaturesBentoGrid'
import { ResortFeatures, HowItWorks, PricingSection, SecuritySection, FAQSection, ContactSection } from './components/MarketingSections'
import './Marketing.scss'

export default function MarketingPage() {
  return (
    <div className="marketing-page">
      <MarketingNav />
      <HeroSection />
      <TechStackBanner />
      <FeaturesBentoGrid />
      <ResortFeatures />
      <HowItWorks />
      <PricingSection />
      <SecuritySection />
      <FAQSection />
      <ContactSection />
      
      <footer className="marketing-footer">
        <div className="footer-container">
          <div className="footer-info">
            <div className="brand">
              <div className="logo-icon-small">FR</div>
              <span className="brand-text">Futura Resorts</span>
            </div>
            <p className="footer-desc">Complete Resort & Restaurant Management System built for modern hospitality businesses. Streamline your operations and delight your guests.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#integrations">Integrations</a></li>
                <li><a href="#changelog">Changelog</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#community">Community</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#cookie">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="copyright">&copy; {new Date().getFullYear()} Futura Resorts. All rights reserved.</p>
      </footer>
    </div>
  )
}
