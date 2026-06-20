'use client'

import React from 'react'
import { LayoutDashboard, Store, ShieldCheck, Database, Server, UtensilsCrossed } from 'lucide-react'
import '../Marketing.scss'

export function FeaturesBentoGrid() {
  return (
    <section className="bento-section">
      <div className="bento-header">
        <h2 className="section-title">Technical Excellence at the Core</h2>
        <p className="section-subtitle">Everything you need to run your resort, architected for scale.</p>
      </div>

      <div className="bento-grid">
        {/* Large Card 1 */}
        <div className="bento-card col-span-2 bg-gradient">
          <div className="bento-content">
            <LayoutDashboard size={40} className="bento-icon" />
            <h3>Customer Web Application</h3>
            <p>A lightning-fast Single Page Application (SPA) built with React Router. Features real-time Cart state management, seamless Checkout flows, and detailed Order History tracking for every user.</p>
          </div>
          <div className="bento-abstract abstract-1"></div>
        </div>

        {/* Square Card 1 */}
        <div className="bento-card">
          <div className="bento-content">
            <ShieldCheck size={36} className="bento-icon" />
            <h3>Secure Auth</h3>
            <p>Passwords hashed with bcrypt. JWTs provide stateless API verification.</p>
          </div>
        </div>

        {/* Square Card 2 */}
        <div className="bento-card">
          <div className="bento-content">
            <Database size={36} className="bento-icon" />
            <h3>MongoDB</h3>
            <p>Flexible NoSQL storage using robust Mongoose schemas.</p>
          </div>
        </div>

        {/* Large Card 2 */}
        <div className="bento-card col-span-2">
          <div className="bento-content">
            <Store size={40} className="bento-icon" />
            <h3>Admin & Staff Dashboard</h3>
            <p>Role-Based Access Control (RBAC) granting specific views to Managers, Chefs, and Service Staff. Manage incoming orders from Pending to Delivered, handle full Menu CRUD operations, and oversee user activity.</p>
          </div>
          <div className="bento-abstract abstract-2"></div>
        </div>

        {/* Square Card 3 */}
        <div className="bento-card">
          <div className="bento-content">
            <Server size={36} className="bento-icon" />
            <h3>Express API</h3>
            <p>Lightweight Node backend handling standard HTTP verbs securely.</p>
          </div>
        </div>

        {/* Square Card 4 */}
        <div className="bento-card">
          <div className="bento-content">
            <UtensilsCrossed size={36} className="bento-icon" />
            <h3>Order Flow</h3>
            <p>Instantly update order states and coordinate kitchen activities.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
