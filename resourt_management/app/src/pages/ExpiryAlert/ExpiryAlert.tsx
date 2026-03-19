import React, { useState } from 'react';
import './ExpiryAlert.scss';

type Severity = 'expired' | 'critical' | 'warning';

interface ExpiryItem {
  id: number;
  name: string;
  category: string;
  expiryDate: string;
  daysLeft: number;
  severity: Severity;
  quantity: string;
  supplier: string;
  icon: string;
}

const expiryItems: ExpiryItem[] = [
  {
    id: 1,
    name: 'Prawns',
    category: 'SEAFOOD',
    expiryDate: 'Feb 11, 2026',
    daysLeft: -3,
    severity: 'expired',
    quantity: '8 kg',
    supplier: 'Ocean Fresh Co.',
    icon: '🦐',
  },
  {
    id: 2,
    name: 'Tomatoes',
    category: 'VEGETABLE',
    expiryDate: 'Feb 11, 2026',
    daysLeft: -3,
    severity: 'expired',
    quantity: '12 kg',
    supplier: 'Farm Fresh Ltd.',
    icon: '🍅',
  },
  {
    id: 3,
    name: 'Fresh Cream',
    category: 'DAIRY',
    expiryDate: 'Feb 14, 2026',
    daysLeft: 1,
    severity: 'critical',
    quantity: '5 L',
    supplier: 'Dairy Direct',
    icon: '🥛',
  },
  {
    id: 4,
    name: 'Chicken Breast',
    category: 'MEAT',
    expiryDate: 'Feb 15, 2026',
    daysLeft: 2,
    severity: 'critical',
    quantity: '30 kg',
    supplier: 'Prime Meats',
    icon: '🍗',
  },
  {
    id: 5,
    name: 'Basil',
    category: 'HERB',
    expiryDate: 'Feb 18, 2026',
    daysLeft: 5,
    severity: 'warning',
    quantity: '500 g',
    supplier: 'Green Gardens',
    icon: '🌿',
  },
];

const severityConfig = {
  expired: { label: 'Expired', color: '#e74c3c', bg: 'rgba(231,76,60,0.08)', icon: '⛔' },
  critical: { label: 'Critical', color: '#e67e22', bg: 'rgba(230,126,34,0.08)', icon: '🔴' },
  warning: { label: 'Expiring Soon', color: '#f39c12', bg: 'rgba(243,156,18,0.08)', icon: '⚠️' },
};

const ExpiryAlert: React.FC = () => {
  const [resolvedIds, setResolvedIds] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | Severity>('all');

  const handleResolve = (id: number) => {
    setResolvedIds(prev => {
      const next = new Set<number>();
      prev.forEach(value => {
        next.add(value);
      });
      next.add(id);
      return next;
    });
  };

  const filtered = expiryItems.filter(item => {
    if (resolvedIds.has(item.id)) return false;
    if (activeFilter === 'all') return true;
    return item.severity === activeFilter;
  });

  const counts = {
    expired: expiryItems.filter(i => i.severity === 'expired' && !resolvedIds.has(i.id)).length,
    critical: expiryItems.filter(i => i.severity === 'critical' && !resolvedIds.has(i.id)).length,
    warning: expiryItems.filter(i => i.severity === 'warning' && !resolvedIds.has(i.id)).length,
  };

  return (
    <div className="expiry">
      {/* Header */}
      <div className="expiry__header">
        <div>
          <h1 className="expiry__title">Expiration Alerts</h1>
          <p className="expiry__subtitle">Items requiring immediate attention</p>
        </div>
        <div className="expiry__last-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Last checked: Today, 9:00 AM
        </div>
      </div>

      {/* Summary Cards */}
      <div className="expiry__summary">
        <div className="summary-card summary-card--expired">
          <div className="summary-card__icon">⛔</div>
          <div>
            <p className="summary-card__num">{counts.expired}</p>
            <p className="summary-card__label">Expired</p>
          </div>
        </div>
        <div className="summary-card summary-card--critical">
          <div className="summary-card__icon">🔴</div>
          <div>
            <p className="summary-card__num">{counts.critical}</p>
            <p className="summary-card__label">Expiring Today/Tomorrow</p>
          </div>
        </div>
        <div className="summary-card summary-card--warning">
          <div className="summary-card__icon">⚠️</div>
          <div>
            <p className="summary-card__num">{counts.warning}</p>
            <p className="summary-card__label">Expiring This Week</p>
          </div>
        </div>
        <div className="summary-card summary-card--resolved">
          <div className="summary-card__icon">✅</div>
          <div>
            <p className="summary-card__num">{resolvedIds.size}</p>
            <p className="summary-card__label">Resolved Today</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="expiry__filters">
        {(['all', 'expired', 'critical', 'warning'] as const).map(f => (
          <button
            key={f}
            className={`filter-chip ${activeFilter === f ? 'active' : ''} ${f !== 'all' ? `filter-chip--${f}` : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'all' ? 'All Alerts' : severityConfig[f].label}
            {f !== 'all' && counts[f] > 0 && (
              <span className="chip-count">{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="expiry__list">
        {filtered.length === 0 ? (
          <div className="expiry__empty">
            <span>✅</span>
            <h3>All clear!</h3>
            <p>No active expiry alerts in this category.</p>
          </div>
        ) : (
          filtered.map(item => {
            const config = severityConfig[item.severity];
            return (
              <div
                key={item.id}
                className={`alert-card alert-card--${item.severity}`}
                style={{ borderLeftColor: config.color }}
              >
                <div className="alert-card__left">
                  <div className="alert-card__icon-wrap" style={{ background: config.bg }}>
                    <span className="alert-emoji">{item.icon}</span>
                  </div>
                  <div className="alert-card__info">
                    <div className="alert-card__name-row">
                      <h3>{item.name}</h3>
                      <span className="alert-category" style={{ color: config.color, background: config.bg }}>
                        {item.category}
                      </span>
                    </div>
                    <div className="alert-card__meta">
                      <span className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        Expires: <strong style={{ color: config.color }}>{item.expiryDate}</strong>
                      </span>
                      <span className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                          <line x1="8" y1="18" x2="21" y2="18"/>
                          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
                          <line x1="3" y1="18" x2="3.01" y2="18"/>
                        </svg>
                        {item.quantity}
                      </span>
                      <span className="meta-item">🏭 {item.supplier}</span>
                    </div>
                  </div>
                </div>

                <div className="alert-card__right">
                  <div className="days-badge" style={{ background: config.bg, color: config.color }}>
                    {item.daysLeft < 0
                      ? `${Math.abs(item.daysLeft)}d overdue`
                      : item.daysLeft === 0
                      ? 'Expires today'
                      : `${item.daysLeft}d left`}
                  </div>
                  <div className="alert-card__actions">
                    <button className="btn-action btn-action--primary" onClick={() => handleResolve(item.id)}>
                      Action Required
                    </button>
                    <button className="btn-action btn-action--ghost" onClick={() => handleResolve(item.id)}>
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExpiryAlert;
