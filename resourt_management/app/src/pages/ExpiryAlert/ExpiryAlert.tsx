'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/src/store/hooks';
import { fetchExpiryAlerts, resolveAlert, clearExpiryError } from '@/app/src/store/slices/expirySlice';
import { FiAlertTriangle, FiAlertOctagon, FiCheckCircle, FiClock, FiPackage, FiBell, FiX, FiRefreshCw } from 'react-icons/fi';
import { MdOutdoorGrill } from 'react-icons/md';

type Severity = 'expired' | 'critical';

const P = '#2d5a3d';

const getRestaurantId = () => {
  try {
    const session = localStorage.getItem('adminSession');
    if (session) { const parsed = JSON.parse(session); return parsed.user?.restaurantId || parsed.restaurantId || ''; }
  } catch {}
  return '';
};

const getSeverity = (daysLeft: number): Severity => daysLeft < 0 ? 'expired' : 'critical';
const getDaysLeft = (expiryDate: string): number =>
  Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

const SEV = {
  expired: { label: 'Expired', color: '#e74c3c', bg: 'rgba(231,76,60,0.08)', border: 'rgba(231,76,60,0.25)', Icon: FiAlertOctagon },
  critical: { label: 'Expiring Soon', color: '#e67e22', bg: 'rgba(230,126,34,0.08)', border: 'rgba(230,126,34,0.25)', Icon: FiAlertTriangle },
};

const ExpiryAlert = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.expiry);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | Severity>('all');
  const [notifItem, setNotifItem] = useState<any>(null);

  useEffect(() => {
    const restaurantId = getRestaurantId();
    if (restaurantId) dispatch(fetchExpiryAlerts(restaurantId));
  }, [dispatch]);

  const handleResolve = (id: string) => {
    setResolvedIds((prev) => new Set([...prev, id]));
    dispatch(resolveAlert(id));
  };

  const normalized = items.map((item: any) => {
    const expiryDate = item.expiry_date || item.expiryDate || '';
    const daysLeft = getDaysLeft(expiryDate);
    const severity = getSeverity(daysLeft);
    return {
      id: item.id, name: item.name,
      category: (item.category || 'OTHER').toUpperCase(),
      expiryDate: expiryDate ? new Date(expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      daysLeft, severity,
      quantity: `${item.quantity || 0} ${item.unit || 'kg'}`,
      supplier: item.supplier || 'N/A',
    };
  });

  const active = normalized.filter(i => !resolvedIds.has(i.id));
  const filtered = active.filter(i => activeFilter === 'all' || i.severity === activeFilter);
  const counts = {
    expired: active.filter(i => i.severity === 'expired').length,
    critical: active.filter(i => i.severity === 'critical').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {error && (
        <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)', color: '#e74c3c', padding: '12px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>{error}</span>
          <button onClick={() => dispatch(clearExpiryError())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }}><FiX size={16} /></button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Expiry Alerts</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>Items requiring immediate attention</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: '0.8rem' }}>
          <FiClock size={14} />
          Last checked: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Expired', value: counts.expired, color: '#e74c3c', bg: 'rgba(231,76,60,0.08)', Icon: FiAlertOctagon },
          { label: 'Expiring Soon', value: counts.critical, color: '#e67e22', bg: 'rgba(230,126,34,0.08)', Icon: FiAlertTriangle },
          { label: 'Resolved Today', value: resolvedIds.size, color: P, bg: 'rgba(45,90,61,0.08)', Icon: FiCheckCircle },
        ].map(c => (
          <div key={c.label} style={{ background: 'white', borderRadius: 12, padding: '18px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, flexShrink: 0 }}>
              <c.Icon size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{c.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: c.color, margin: 0 }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['all', 'expired', 'critical'] as const).map(f => {
          const count = f === 'all' ? active.length : counts[f];
          const color = f === 'expired' ? '#e74c3c' : f === 'critical' ? '#e67e22' : P;
          const isActive = activeFilter === f;
          return (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '7px 16px', borderRadius: 20, border: isActive ? `1.5px solid ${color}` : '1px solid #e5e7eb',
              background: isActive ? color : 'white', color: isActive ? 'white' : '#555',
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {f === 'all' ? 'All Alerts' : f === 'expired' ? 'Expired' : 'Expiring Soon'}
              <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : '#f3f4f6', borderRadius: 10, padding: '1px 7px', fontSize: '0.72rem' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading expiry alerts...</div>}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed #e5e7eb', borderRadius: 16 }}>
              <FiCheckCircle size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
              <p style={{ fontWeight: 700, color: '#374151', margin: '0 0 4px' }}>All clear!</p>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>No active expiry alerts in this category</p>
            </div>
          ) : filtered.map(item => {
            const cfg = SEV[item.severity];
            return (
              <div key={item.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: `1px solid ${cfg.border}`, borderLeft: `4px solid ${cfg.color}`, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, flexShrink: 0 }}>
                    <cfg.Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>{item.name}</h3>
                      <span style={{ padding: '2px 10px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: '0.7rem', fontWeight: 700 }}>{item.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#666' }}>
                        <FiClock size={12} /> Expires: <strong style={{ color: cfg.color }}>{item.expiryDate}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#666' }}>
                        <FiPackage size={12} /> {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <div style={{ padding: '6px 14px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.8rem' }}>
                    {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)}d overdue` : item.daysLeft === 0 ? 'Today' : `${item.daysLeft}d left`}
                  </div>
                  <button onClick={() => setNotifItem(item)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, background: cfg.color, color: 'white', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <FiBell size={13} /> Action
                  </button>
                  <button onClick={() => handleResolve(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, background: 'rgba(45,90,61,0.08)', color: P, border: `1px solid rgba(45,90,61,0.2)`, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <FiCheckCircle size={13} /> Resolve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      {notifItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 460, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderLeft: `4px solid ${SEV[notifItem.severity].color}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: SEV[notifItem.severity].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: SEV[notifItem.severity].color }}>
                  {(() => { const NIcon = SEV[notifItem.severity].Icon; return <NIcon size={18} />; })()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>{notifItem.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{notifItem.category}</span>
                </div>
              </div>
              <button onClick={() => setNotifItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Expiry Date', value: notifItem.expiryDate, color: SEV[notifItem.severity].color },
                  { label: 'Status', value: notifItem.daysLeft < 0 ? `${Math.abs(notifItem.daysLeft)}d overdue` : `${notifItem.daysLeft}d left`, color: SEV[notifItem.severity].color },
                  { label: 'Current Stock', value: notifItem.quantity, color: '#1a1a1a' },
                  { label: 'Supplier', value: notifItem.supplier, color: '#1a1a1a' },
                ].map(info => (
                  <div key={info.label} style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px' }}>
                    <p style={{ fontSize: '0.7rem', color: '#888', margin: '0 0 4px', textTransform: 'uppercase' }}>{info.label}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: info.color, margin: 0 }}>{info.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: SEV[notifItem.severity].bg, border: `1px solid ${SEV[notifItem.severity].border}`, borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontWeight: 700, color: SEV[notifItem.severity].color, margin: '0 0 6px', fontSize: '0.85rem' }}>Recommended Action</p>
                <p style={{ color: '#444', fontSize: '0.83rem', margin: 0, lineHeight: 1.5 }}>
                  {notifItem.severity === 'expired'
                    ? 'This item has expired. Discard immediately to avoid health risks and compliance issues.'
                    : 'This item is expiring very soon. Use it in your next preparation or arrange disposal immediately.'}
                </p>
              </div>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10 }}>
              <button onClick={() => setNotifItem(null)} style={{ flex: 1, padding: 12, background: '#f3f4f6', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Close</button>
              <button onClick={() => { handleResolve(notifItem.id); setNotifItem(null); }} style={{ flex: 1, padding: 12, background: P, border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <FiCheckCircle size={15} /> Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiryAlert;