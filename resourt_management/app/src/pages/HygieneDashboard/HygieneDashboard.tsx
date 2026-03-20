"use client";

import React, { useState } from 'react';
import './HygieneDashboard.scss';

interface SanitizationLog {
  id: number;
  type: string;
  employee: string;
  date: string;
  time: string;
  status: 'done' | 'pending';
}

interface Certification {
  name: string;
  code: string;
  level: string;
  issueDate: string;
  expiryDate: string;
  daysLeft: number;
}

const certifications: Certification[] = [
  {
    name: 'SL Certification',
    code: 'FSSAI Level 4',
    level: 'Standard License Level 4',
    issueDate: 'Jan 12, 2025',
    expiryDate: 'Jan 12, 2026',
    daysLeft: 290,
  },
];

const sanitizationLogs: SanitizationLog[] = [
  { id: 1, type: 'Surface Prep',  employee: 'Sunil',   date: 'Jun 20, 2030', time: '11:30 PM', status: 'done' },
  { id: 2, type: 'Deep Clean',    employee: 'Pradeep', date: 'Jun 20, 2030', time: '12:00 PM', status: 'done' },
  { id: 3, type: 'Tanks Clean',   employee: 'Sunil',   date: 'Jun 20, 2030', time: '12:00 PM', status: 'done' },
  { id: 4, type: 'Equipment Wipe',employee: 'Maya',    date: 'Jun 20, 2030', time: '01:00 PM', status: 'pending' },
];

const sanitizationIcons: Record<string, string> = {
  'Surface Prep': '🧽',
  'Deep Clean': '🧹',
  'Tanks Clean': '🪣',
  'Equipment Wipe': '🧴',
};

const HygieneDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certifications' | 'logs' | 'schedule'>('certifications');

  const complianceScore = 94;

  return (
    <div className="hygiene">
      {/* Header */}
      <div className="hygiene__header">
        <div>
          <h1 className="hygiene__title">Hygiene & Compliance</h1>
          <p className="hygiene__subtitle">Monitor food safety standards and sanitization records</p>
        </div>
        <button className="btn-add-cert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Log Sanitization
        </button>
      </div>

      {/* Score Banner */}
      <div className="compliance-banner">
        <div className="compliance-banner__score">
          <div className="score-ring">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6"/>
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="#fff"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 34 * complianceScore / 100} ${2 * Math.PI * 34}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <span className="score-value">{complianceScore}%</span>
          </div>
          <div className="compliance-banner__info">
            <h3>Compliance Score</h3>
            <p>Excellent — All major checks passed</p>
          </div>
        </div>
        <div className="compliance-banner__stats">
          <div className="cs-stat">
            <span className="cs-stat__num">12</span>
            <span className="cs-stat__label">Checks This Week</span>
          </div>
          <div className="cs-stat">
            <span className="cs-stat__num">2</span>
            <span className="cs-stat__label">Pending Tasks</span>
          </div>
          <div className="cs-stat">
            <span className="cs-stat__num">1</span>
            <span className="cs-stat__label">Active Certifications</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="hygiene__tabs">
        {(['certifications', 'logs', 'schedule'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'certifications' ? '🏅 Certifications' : tab === 'logs' ? '📋 Sanitization Logs' : '📅 Schedule'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'certifications' && (
        <div className="hygiene__section">
          <h2 className="section-title">Food Safety Certifications</h2>
          <div className="cert-grid">
            {certifications.map((cert, i) => (
              <div key={i} className="cert-card">
                <div className="cert-card__top">
                  <div className="cert-card__badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="6"/>
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                  </div>
                  <div className="cert-card__info">
                    <h3>{cert.name}</h3>
                    <p className="cert-code">{cert.code}</p>
                    <p className="cert-level">{cert.level}</p>
                  </div>
                  <div className="cert-card__logo">
                    <div className="cert-logo-box">SL</div>
                  </div>
                </div>
                <div className="cert-card__dates">
                  <div className="cert-date">
                    <span className="cert-date__label">Issue Date</span>
                    <span className="cert-date__value">{cert.issueDate}</span>
                  </div>
                  <div className="cert-date">
                    <span className="cert-date__label">Expiry Date</span>
                    <span className="cert-date__value expiry">{cert.expiryDate}</span>
                  </div>
                </div>
                <div className="cert-card__progress">
                  <div className="cert-progress-label">
                    <span>Validity</span>
                    <span className="days-left">{cert.daysLeft} days left</span>
                  </div>
                  <div className="cert-progress-bar">
                    <div className="cert-progress-fill" style={{ width: `${(cert.daysLeft / 365) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="hygiene__section">
          <h2 className="section-title">Recent Sanitization Log</h2>
          <div className="log-table-card">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Session Type</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sanitizationLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div className="log-type">
                        <span className="log-icon">{sanitizationIcons[log.type] || '🧼'}</span>
                        {log.type}
                      </div>
                    </td>
                    <td className="log-employee">{log.employee}</td>
                    <td className="log-date">{log.date}</td>
                    <td className="log-time">{log.time}</td>
                    <td>
                      <span className={`log-status log-status--${log.status}`}>
                        {log.status === 'done' ? '✓ Done' : '○ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="hygiene__section">
          <div className="schedule-empty">
            <span>📅</span>
            <h3>Schedule Coming Soon</h3>
            <p>Set up recurring sanitization schedules for your kitchen team.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HygieneDashboard;
