"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/src/store/hooks';
import {
  fetchExpiryAlerts,
  resolveAlert,
  clearExpiryError,
} from '@/app/src/store/slices/expirySlice';
import './ExpiryAlert.scss';

type Severity = 'expired' | 'critical' | 'warning';

const severityConfig = {
  expired: { label: 'Expired', color: '#e74c3c', bg: 'rgba(231,76,60,0.08)', icon: '⛔' },
  critical: { label: 'Critical', color: '#e67e22', bg: 'rgba(230,126,34,0.08)', icon: '🔴' },
  warning: { label: 'Expiring Soon', color: '#f39c12', bg: 'rgba(243,156,18,0.08)', icon: '⚠️' },
};

const categoryIcons: Record<string, string> = {
  SEAFOOD: '🦐',
  MEAT: '🍗',
  VEGETABLE: '🥬',
  DAIRY: '🥛',
  HERB: '🌿',
  SPICE: '🌶',
};

const getRestaurantId = () => {
  const session = localStorage.getItem('adminSession');
  if (session) {
    const parsed = JSON.parse(session);
    return parsed.user?.restaurantId || parsed.restaurantId || '';
  }
  return '';
};

const getSeverity = (daysLeft: number): Severity => {
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 2) return 'critical';
  return 'warning';
};

const getDaysLeft = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = Math.floor(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

const ExpiryAlert = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.expiry);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | Severity>('all');

  useEffect(() => {
    const restaurantId = getRestaurantId();
    if (restaurantId) {
      dispatch(fetchExpiryAlerts(restaurantId));
    }
  }, [dispatch]);

  const handleResolve = (id: string) => {
    setResolvedIds((prev) => new Set([...prev, id]));
    dispatch(resolveAlert(id));
  };

  // Normalize backend data to component shape
  const normalizedItems = items.map((item: any) => {
    const expiryDate = item.expiry_date || item.expiryDate || '';
    const daysLeft = getDaysLeft(expiryDate);
    const severity = getSeverity(daysLeft);
    const category = (item.category || 'OTHER').toUpperCase();

    return {
      id: item.id,
      name: item.name,
      category,
      expiryDate: expiryDate
        ? new Date(expiryDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
      daysLeft,
      severity,
      quantity: `${item.quantity || 0} ${item.unit || 'kg'}`,
      supplier: item.supplier || 'Unknown Supplier',
      icon: categoryIcons[category] || '📦',
    };
  });

  const activeItems = normalizedItems.filter(
    (item) => !resolvedIds.has(item.id)
  );

  const filtered = activeItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.severity === activeFilter;
  });

  const counts = {
    expired: activeItems.filter((i) => i.severity === 'expired').length,
    critical: activeItems.filter((i) => i.severity === 'critical').length,
    warning: activeItems.filter((i) => i.severity === 'warning').length,
  };

  return (
    <div className="expiry">
      {/* Error */}
      {error && (
        <div
          style={{
            background: '#fde8e8',
            color: '#e74c3c',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          ✗ {error}
          <button
            onClick={() => dispatch(clearExpiryError())}
            style={{
              marginLeft: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#e74c3c',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="expiry__header">
        <div>
          <h1 className="expiry__title">Expiration Alerts</h1>
          <p className="expiry__subtitle">
            Items requiring immediate attention
          </p>
        </div>
        <div className="expiry__last-check">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Last checked: Today,{' '}
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
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
        {(['all', 'expired', 'critical', 'warning'] as const).map((f) => (
          <button
            key={f}
            className={`filter-chip ${activeFilter === f ? 'active' : ''} ${
              f !== 'all' ? `filter-chip--${f}` : ''
            }`}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'all' ? 'All Alerts' : severityConfig[f].label}
            {f !== 'all' && counts[f] > 0 && (
              <span className="chip-count">{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{ textAlign: 'center', padding: '40px', color: '#718096' }}
        >
          Loading expiry alerts...
        </div>
      )}

      {/* Alert List */}
      {!loading && (
        <div className="expiry__list">
          {filtered.length === 0 ? (
            <div className="expiry__empty">
              <span>✅</span>
              <h3>All clear!</h3>
              <p>No active expiry alerts in this category.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const config = severityConfig[item.severity];
              return (
                <div
                  key={item.id}
                  className={`alert-card alert-card--${item.severity}`}
                  style={{ borderLeftColor: config.color }}
                >
                  <div className="alert-card__left">
                    <div
                      className="alert-card__icon-wrap"
                      style={{ background: config.bg }}
                    >
                      <span className="alert-emoji">{item.icon}</span>
                    </div>
                    <div className="alert-card__info">
                      <div className="alert-card__name-row">
                        <h3>{item.name}</h3>
                        <span
                          className="alert-category"
                          style={{
                            color: config.color,
                            background: config.bg,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div className="alert-card__meta">
                        <span className="meta-item">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Expires:{' '}
                          <strong style={{ color: config.color }}>
                            {item.expiryDate}
                          </strong>
                        </span>
                        <span className="meta-item">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                          </svg>
                          {item.quantity}
                        </span>
                        <span className="meta-item">
                          🏭 {item.supplier}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="alert-card__right">
                    <div
                      className="days-badge"
                      style={{
                        background: config.bg,
                        color: config.color,
                      }}
                    >
                      {item.daysLeft < 0
                        ? `${Math.abs(item.daysLeft)}d overdue`
                        : item.daysLeft === 0
                        ? 'Expires today'
                        : `${item.daysLeft}d left`}
                    </div>
                    <div className="alert-card__actions">
                      <button
                        className="btn-action btn-action--primary"
                        onClick={() => handleResolve(item.id)}
                      >
                        Action Required
                      </button>
                      <button
                        className="btn-action btn-action--ghost"
                        onClick={() => handleResolve(item.id)}
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ExpiryAlert;