'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiSettings, FiUser, FiLock, FiBell, FiGlobe,
  FiChevronRight, FiSave, FiShield, FiDatabase, FiMoon,
  FiMail, FiPhone, FiMapPin, FiAlertCircle, FiX,
  FiSun, FiDownload, FiCheck, FiEye, FiEyeOff,
  FiMonitor, FiSmartphone, FiClock, FiLogOut
} from 'react-icons/fi';
import { MdQrCode2, MdRestaurantMenu } from 'react-icons/md';

const P = '#2d5a3d';
const API = 'http://localhost:8000';

const getSession = () => {
  try {
    const s = localStorage.getItem('adminSession');
    if (s) {
      const p = JSON.parse(s);
      return {
        name: p.user?.name || 'Admin',
        email: p.user?.email || '',
        role: p.user?.role || 'admin',
        restaurantId: p.user?.restaurantId || '',
        token: p.token || '',
        userId: p.user?.id || p.userId || '',
      };
    }
  } catch {}
  return { name: 'Admin', email: '', role: 'admin', restaurantId: '', token: '', userId: '' };
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
  borderRadius: 9, fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box' as const, color: '#1a1a1a', background: 'white',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.73rem', fontWeight: 700, color: '#555',
  textTransform: 'uppercase' as const, letterSpacing: '0.3px',
  display: 'block', marginBottom: 5,
};
const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '10px 20px', background: P, color: 'white',
  border: 'none', borderRadius: 9, fontWeight: 700,
  fontSize: '0.87rem', cursor: 'pointer',
};
const btnGhost: React.CSSProperties = {
  padding: '10px 20px', background: '#f3f4f6', color: '#374151',
  border: 'none', borderRadius: 9, fontWeight: 600,
  fontSize: '0.87rem', cursor: 'pointer',
};

/* Ã¢â€â‚¬Ã¢â€â‚¬ Modal Shell Ã¢â€â‚¬Ã¢â€â‚¬ */
const Modal = ({ title, icon: Icon, onClose, children, iconColor = P }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
    <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: '100%', maxWidth: 500, overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${iconColor}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
            <Icon size={17} />
          </div>
          <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '1rem' }}>{title}</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}><FiX size={18} /></button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

/* Ã¢â€â‚¬Ã¢â€â‚¬ Success Banner Ã¢â€â‚¬Ã¢â€â‚¬ */
const SuccessBanner = ({ msg }: { msg: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(45,90,61,0.08)', border: '1px solid rgba(45,90,61,0.2)', borderRadius: 9, color: P, fontWeight: 600, fontSize: '0.85rem', marginTop: 16 }}>
    <FiCheck size={15} /> {msg}
  </div>
);

/* Ã¢â€â‚¬Ã¢â€â‚¬ Error Banner Ã¢â€â‚¬Ã¢â€â‚¬ */
const ErrBanner = ({ msg }: { msg: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, color: '#dc2626', fontSize: '0.85rem', marginTop: 16 }}>
    <FiAlertCircle size={15} /> {msg}
  </div>
);

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   MODAL 1 Ã¢â‚¬â€ Account Profile
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
const AccountProfileModal = ({ onClose }: any) => {
  const session = getSession();
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) { setErr('Name and email are required'); return; }
    setSaving(true); setErr(''); setSuccess('');
    try {
      const res = await fetch(`${API}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ userId: session.userId, name, email, mobileNumber: phone }),
      });
      const data = await res.json();
      if (data.success) {
        const raw = localStorage.getItem('adminSession');
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.user = { ...parsed.user, name, email };
          localStorage.setItem('adminSession', JSON.stringify(parsed));
        }
        setSuccess('Profile updated successfully!');
      } else {
        setErr(data.error || 'Failed to update profile');
      }
    } catch {
      setErr('Network error Ã¢â‚¬â€ changes saved locally');
      const raw = localStorage.getItem('adminSession');
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.user = { ...parsed.user, name, email };
        localStorage.setItem('adminSession', JSON.stringify(parsed));
      }
      setSuccess('Profile saved locally');
    } finally { setSaving(false); }
  };

  return (
    <Modal title="Account Profile" icon={FiUser} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: '#f9fafb', borderRadius: 12, marginBottom: 4 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: P, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>{name}</p>
            <p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>{session.role.toUpperCase()}</p>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
        </div>
        <div>
          <label style={labelStyle}><FiMail size={11} style={{ marginRight: 4 }} />Email Address</label>
          <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@restaurant.com" />
        </div>
        <div>
          <label style={labelStyle}><FiPhone size={11} style={{ marginRight: 4 }} />Mobile Number</label>
          <input style={inputStyle} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 XX XXX XXXX" />
        </div>
        {success && <SuccessBanner msg={success} />}
        {err && <ErrBanner msg={err} />}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
            <FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   MODAL 2 Ã¢â‚¬â€ Change Password
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
const ChangePasswordModal = ({ onClose }: any) => {
  const session = getSession();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');

  const strength = next.length === 0 ? 0 : next.length < 6 ? 1 : next.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColor = ['', '#e74c3c', '#f39c12', '#27ae60'];

  const handleSave = async () => {
    if (!current || !next || !confirm) { setErr('All fields are required'); return; }
    if (next !== confirm) { setErr('New passwords do not match'); return; }
    if (next.length < 6) { setErr('Password must be at least 6 characters'); return; }
    setSaving(true); setErr(''); setSuccess('');
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ userId: session.userId, currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (data.success) { setSuccess('Password changed successfully!'); setCurrent(''); setNext(''); setConfirm(''); }
      else setErr(data.error || 'Failed to change password');
    } catch { setErr('Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  const EyeBtn = ({ show, toggle }: any) => (
    <button onClick={toggle} style={{ position: 'absolute' as const, right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
      {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
    </button>
  );

  return (
    <Modal title="Change Password" icon={FiLock} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Current Password</label>
          <div style={{ position: 'relative' as const }}>
            <input style={{ ...inputStyle, paddingRight: 40 }} type={showCurrent ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} placeholder="Enter current password" />
            <EyeBtn show={showCurrent} toggle={() => setShowCurrent(v => !v)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>New Password</label>
          <div style={{ position: 'relative' as const }}>
            <input style={{ ...inputStyle, paddingRight: 40 }} type={showNext ? 'text' : 'password'} value={next} onChange={e => setNext(e.target.value)} placeholder="Minimum 6 characters" />
            <EyeBtn show={showNext} toggle={() => setShowNext(v => !v)} />
          </div>
          {next.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: strength >= i ? strengthColor[strength] : '#e5e7eb', transition: 'background 0.2s' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: strengthColor[strength], fontWeight: 600 }}>{strengthLabel[strength]}</span>
            </div>
          )}
        </div>
        <div>
          <label style={labelStyle}>Confirm New Password</label>
          <input style={{ ...inputStyle, borderColor: confirm && confirm !== next ? '#e74c3c' : '#e5e7eb' }} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" />
          {confirm && confirm !== next && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#e74c3c' }}>Passwords do not match</p>}
        </div>
        {success && <SuccessBanner msg={success} />}
        {err && <ErrBanner msg={err} />}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
            <FiLock size={14} /> {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   MODAL 3 Ã¢â‚¬â€ Security Settings
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
const SecurityModal = ({ onClose }: any) => {
  const session = getSession();
  const [twoFA, setTwoFA] = useState(false);
  const [autoLogout, setAutoLogout] = useState('60');
  const loginTime = new Date().toLocaleString();

  const Toggle = ({ value, onChange }: any) => (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: value ? P : '#e5e7eb', position: 'relative' as const, transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute' as const, top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </div>
  );

  return (
    <Modal title="Security Settings" icon={FiShield} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#1a1a1a', fontSize: '0.88rem' }}>Current Session</p>
          {[
            { Icon: FiUser, label: 'User', value: session.name },
            { Icon: FiMonitor, label: 'Device', value: 'Web Browser' },
            { Icon: FiClock, label: 'Login Time', value: loginTime },
            { Icon: FiMapPin, label: 'Role', value: session.role.toUpperCase() },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f0f0f0' }}>
              <r.Icon size={13} color="#888" />
              <span style={{ fontSize: '0.78rem', color: '#888', width: 80 }}>{r.label}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a' }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', borderRadius: 10 }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>Two-Factor Authentication</p>
            <p style={{ margin: 0, color: '#888', fontSize: '0.76rem' }}>Extra layer of login security</p>
          </div>
          <Toggle value={twoFA} onChange={setTwoFA} />
        </div>

        <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: 10 }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>Auto Logout (minutes)</p>
          <select value={autoLogout} onChange={e => setAutoLogout(e.target.value)} style={{ ...inputStyle, background: 'white' }}>
            {['15', '30', '60', '120', '240'].map(v => <option key={v} value={v}>{v} minutes</option>)}
          </select>
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: '#dc2626', fontSize: '0.88rem' }}>Sign Out All Devices</p>
            <p style={{ margin: 0, color: '#888', fontSize: '0.76rem' }}>Invalidates all active sessions</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#dc2626', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            <FiLogOut size={13} /> Sign Out All
          </button>
        </div>

        <button style={{ ...btnPrimary, justifyContent: 'center' }} onClick={() => { localStorage.setItem('securitySettings', JSON.stringify({ twoFA, autoLogout })); onClose(); }}>
          <FiSave size={14} /> Save Security Settings
        </button>
      </div>
    </Modal>
  );
};

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   MODAL 4 Ã¢â‚¬â€ Language & Region
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
const LanguageModal = ({ onClose }: any) => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('langSettings') || '{}' ); } catch { return {}; } })();
  const [language, setLanguage] = useState(saved.language || 'en');
  const [timezone, setTimezone] = useState(saved.timezone || 'Asia/Colombo');
  const [currency, setCurrency] = useState(saved.currency || 'LKR');
  const [dateFormat, setDateFormat] = useState(saved.dateFormat || 'DD/MM/YYYY');
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    localStorage.setItem('langSettings', JSON.stringify({ language, timezone, currency, dateFormat }));
    setSuccess('Language & region settings saved!');
    setTimeout(onClose, 1500);
  };

  const Row = ({ label, children }: any) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  return (
    <Modal title="Language & Region" icon={FiGlobe} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Row label="Language">
          <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
            <option value="en">English</option>
            <option value="si">Sinhala (Ã Â·Æ’Ã Â·â€™Ã Â¶â€šÃ Â·â€žÃ Â¶Â½)</option>
            <option value="ta">Tamil (Ã Â®Â¤Ã Â®Â®Ã Â®Â¿Ã Â®Â´Ã Â¯Â)</option>
          </select>
        </Row>
        <Row label="Timezone">
          <select value={timezone} onChange={e => setTimezone(e.target.value)} style={inputStyle}>
            <option value="Asia/Colombo">Asia/Colombo (GMT+5:30)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
            <option value="UTC">UTC (GMT+0)</option>
            <option value="America/New_York">America/New_York (GMT-5)</option>
            <option value="Europe/London">Europe/London (GMT+0)</option>
            <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
          </select>
        </Row>
        <Row label="Currency">
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
            <option value="LKR">LKR Ã¢â‚¬â€ Sri Lankan Rupee</option>
            <option value="USD">USD Ã¢â‚¬â€ US Dollar</option>
            <option value="EUR">EUR Ã¢â‚¬â€ Euro</option>
            <option value="GBP">GBP Ã¢â‚¬â€ British Pound</option>
            <option value="INR">INR Ã¢â‚¬â€ Indian Rupee</option>
            <option value="AED">AED Ã¢â‚¬â€ UAE Dirham</option>
          </select>
        </Row>
        <Row label="Date Format">
          <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={inputStyle}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </Row>
        <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: 9 }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Preview</p>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#1a1a1a', fontWeight: 600 }}>
            {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'si' ? 'si-LK' : 'ta-LK')} Ã‚Â· {currency} Ã‚Â· {timezone}
          </p>
        </div>
        {success && <SuccessBanner msg={success} />}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }} onClick={handleSave}>
            <FiSave size={14} /> Save Preferences
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   MODAL 5 Ã¢â‚¬â€ Data & Backup
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
const DataBackupModal = ({ onClose }: any) => {
  const session = getSession();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string[]>([]);

  const exportData = async (type: string) => {
    setExporting(type);
    const headers = { Authorization: `Bearer ${session.token}`, 'x-user-role': 'admin', 'x-restaurant-id': session.restaurantId };
    try {
      let data: any[] = [];
      if (type === 'inventory') {
        const res = await fetch(`${API}/api/inventory/restaurant/${session.restaurantId}`, { headers });
        const d = await res.json();
        data = d.inventory || d.ingredients || [];
      } else if (type === 'orders') {
        const res = await fetch(`${API}/api/orders/restaurant/${session.restaurantId}/orders`, { headers });
        const d = await res.json();
        data = d.orders || [];
      } else if (type === 'logs') {
        const res = await fetch(`${API}/api/auth/logs/${session.restaurantId}?limit=500`, { headers });
        const d = await res.json();
        data = d.logs || [];
      }
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `dinesmart-${type}-${new Date().toISOString().split('T')[0]}.json`; a.click();
      URL.revokeObjectURL(url);
      setExported(prev => [...prev, type]);
    } catch {}
    finally { setExporting(null); }
  };

  const exportItems = [
    { key: 'inventory', label: 'Inventory Data', desc: 'All ingredients, stock levels, expiry dates', color: P },
    { key: 'orders', label: 'Orders History', desc: 'All orders with items and status', color: '#3b82f6' },
    { key: 'logs', label: 'Activity Logs', desc: 'Admin and staff login/logout records', color: '#8b5cf6' },
  ];

  return (
    <Modal title="Data & Backup" icon={FiDatabase} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: '10px 14px', background: 'rgba(45,90,61,0.06)', borderRadius: 9, fontSize: '0.82rem', color: P, fontWeight: 600 }}>
          Ã°Å¸â€™Â¡ All data is exported as JSON format for easy import and backup.
        </div>
        {exportItems.map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f9fafb', borderRadius: 10, border: exported.includes(item.key) ? `1px solid ${item.color}30` : '1px solid transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                <FiDatabase size={16} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.88rem' }}>{item.label}</p>
                <p style={{ margin: 0, color: '#888', fontSize: '0.76rem' }}>{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => exportData(item.key)}
              disabled={exporting === item.key}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: exported.includes(item.key) ? `${item.color}12` : item.color, color: exported.includes(item.key) ? item.color : 'white', border: exported.includes(item.key) ? `1px solid ${item.color}30` : 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', opacity: exporting === item.key ? 0.6 : 1 }}
            >
              {exported.includes(item.key) ? <FiCheck size={13} /> : <FiDownload size={13} />}
              {exporting === item.key ? 'Exporting...' : exported.includes(item.key) ? 'Downloaded' : 'Export'}
            </button>
          </div>
        ))}
        <div style={{ marginTop: 4, padding: '12px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#dc2626', fontSize: '0.85rem' }}>Clear All Data</p>
          <p style={{ margin: '0 0 10px', color: '#888', fontSize: '0.76rem' }}>Permanently removes all restaurant data from the database.</p>
          <button style={{ padding: '7px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#dc2626', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            Clear All Data
          </button>
        </div>
        <button style={{ ...btnGhost, textAlign: 'center' as const }} onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   MODAL 6 Ã¢â‚¬â€ Appearance
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
const AppearanceModal = ({ onClose }: any) => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('appearanceSettings') || '{}' ); } catch { return {}; } })();
  const [theme, setTheme] = useState(saved.theme || 'light');
  const [sidebarColor, setSidebarColor] = useState(saved.sidebarColor || P);
  const [fontSize, setFontSize] = useState(saved.fontSize || 'medium');
  const [success, setSuccess] = useState('');

  const themes = [
    { key: 'light', label: 'Light', Icon: FiSun, bg: '#ffffff', border: '#e5e7eb' },
    { key: 'dark', label: 'Dark', Icon: FiMoon, bg: '#1a1a2e', border: '#333' },
    { key: 'system', label: 'System', Icon: FiMonitor, bg: 'linear-gradient(135deg,#fff 50%,#1a1a2e 50%)', border: '#e5e7eb' },
  ];

  const colors = ['#2d5a3d', '#1a3d5c', '#5c1a1a', '#3d1a5c', '#1a4a4a', '#4a3d1a'];

  const handleSave = () => {
    localStorage.setItem('appearanceSettings', JSON.stringify({ theme, sidebarColor, fontSize }));
    if (theme === 'dark') document.documentElement.style.setProperty('--bg', '#0f0f0f');
    else document.documentElement.style.removeProperty('--bg');
    setSuccess('Appearance saved! Refresh to apply theme.');
    setTimeout(onClose, 1600);
  };

  return (
    <Modal title="Appearance" icon={FiMoon} onClose={onClose} iconColor="#6366f1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        <div>
          <label style={labelStyle}>Theme</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {themes.map(t => (
              <button key={t.key} onClick={() => setTheme(t.key)} style={{ padding: '14px 10px', borderRadius: 10, border: theme === t.key ? `2px solid ${P}` : '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <t.Icon size={16} color={t.key === 'dark' ? 'white' : '#333'} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: theme === t.key ? 700 : 500, color: theme === t.key ? P : '#555' }}>{t.label}</span>
                {theme === t.key && <FiCheck size={12} color={P} />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Sidebar Color</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {colors.map(c => (
              <button key={c} onClick={() => setSidebarColor(c)} style={{ width: 36, height: 36, borderRadius: '50%', background: c, border: sidebarColor === c ? '3px solid #1a1a1a' : '3px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sidebarColor === c && <FiCheck size={14} color="white" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Font Size</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {['small', 'medium', 'large'].map(f => (
              <button key={f} onClick={() => setFontSize(f)} style={{ padding: '9px', borderRadius: 8, border: fontSize === f ? `2px solid ${P}` : '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: fontSize === f ? 700 : 500, color: fontSize === f ? P : '#555', fontSize: f === 'small' ? '0.75rem' : f === 'large' ? '1rem' : '0.87rem' }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {success && <SuccessBanner msg={success} />}

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }} onClick={handleSave}>
            <FiSave size={14} /> Apply Appearance
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   MAIN SETTINGS PAGE
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
const SectionCard = ({ title, icon: Icon, children }: any) => (
  <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 20 }}>
    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
        <Icon size={15} />
      </div>
      <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>{title}</h3>
    </div>
    {children}
  </div>
);

const SettingRow = ({ icon: Icon, label, description, action, color = P, badge }: any) => (
  <div
    onClick={action}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s' }}
    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'white'}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        <Icon size={17} />
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', fontSize: '0.9rem' }}>{label}</p>
        <p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>{description}</p>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {badge && <span style={{ padding: '2px 8px', background: `${color}14`, color, borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>{badge}</span>}
      <FiChevronRight size={16} color="#aaa" />
    </div>
  </div>
);

const Settings = () => {
  const router = useRouter();
  const session = getSession();
  const [modal, setModal] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ expiryAlerts: true, orderUpdates: true, lowStock: true });
  const [restaurantName, setRestaurantName] = useState('DineSmart Restaurant');
  const [email, setEmail] = useState(session.email);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    try {
      const n = JSON.parse(localStorage.getItem('notifSettings') || '{}' );
      if (Object.keys(n).length) setNotifications(n);
    } catch {}
  }, []);

  const handleSave = () => {
    localStorage.setItem('notifSettings', JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp: React.CSSProperties = { width: '100%', padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: 9, fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' as const, color: '#1a1a1a' };
  const lbl: React.CSSProperties = { fontSize: '0.73rem', fontWeight: 700, color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.3px', display: 'block', marginBottom: 5 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 820, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Settings</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>Manage your restaurant preferences</p>
        </div>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', border: 'none', borderRadius: 9, background: P, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.87rem' }}>
          <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(45,90,61,0.08)', border: '1px solid rgba(45,90,61,0.2)', color: P, padding: '10px 16px', borderRadius: 9, fontWeight: 600, fontSize: '0.85rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiCheck size={14} /> Settings saved successfully
        </div>
      )}

      {/* Profile Banner */}
      <div style={{ background: `linear-gradient(135deg, ${P}, #1a3d28)`, borderRadius: 14, padding: '24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
          {session.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{session.name}</h2>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{session.email}</p>
          <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{session.role}</span>
        </div>
        <button onClick={() => setModal('profile')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 9, color: 'white', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
          <FiUser size={13} /> Edit Profile
        </button>
      </div>

      {/* QR Code Featured */}
      <div onClick={() => router.push('/admin/qr-code')} style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', padding: '20px 24px', marginBottom: 20, cursor: 'pointer', border: '2px solid rgba(45,90,61,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = P}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,90,61,0.15)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
            <MdQrCode2 size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '1rem' }}>QR Code Generator</h3>
            <p style={{ margin: '3px 0 0', color: '#888', fontSize: '0.82rem' }}>Generate & print QR codes for your tables</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, color: P, fontSize: '0.78rem', fontWeight: 700 }}>Open Generator <FiChevronRight size={13} /></span>
          </div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: P, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
          <FiChevronRight size={18} />
        </div>
      </div>

      {/* Restaurant Info */}
      <SectionCard title="Restaurant Information" icon={MdRestaurantMenu}>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Restaurant Name</label><input style={inp} type="text" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} /></div>
          <div><label style={lbl}><FiMail size={11} style={{ marginRight: 4 }} />Email</label><input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="restaurant@email.com" /></div>
          <div><label style={lbl}><FiPhone size={11} style={{ marginRight: 4 }} />Phone</label><input style={inp} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 XX XXX XXXX" /></div>
          <div style={{ gridColumn: '1 / -1' }}><label style={lbl}><FiMapPin size={11} style={{ marginRight: 4 }} />Address</label><input style={inp} type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City, Province" /></div>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" icon={FiBell}>
        {[
          { key: 'expiryAlerts', label: 'Expiry Alerts', desc: 'Get notified when items are about to expire' },
          { key: 'orderUpdates', label: 'Order Updates', desc: 'Notifications for new and updated orders' },
          { key: 'lowStock', label: 'Low Stock Warnings', desc: 'Alert when inventory falls below threshold' },
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>{item.label}</p>
              <p style={{ margin: 0, color: '#888', fontSize: '0.76rem' }}>{item.desc}</p>
            </div>
            <div onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s', background: notifications[item.key as keyof typeof notifications] ? P : '#e5e7eb', position: 'relative' as const }}>
              <div style={{ position: 'absolute' as const, top: 3, transition: 'left 0.2s', left: notifications[item.key as keyof typeof notifications] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </SectionCard>

      {/* Quick Actions */}
      <SectionCard title="Quick Actions" icon={FiSettings}>
        <SettingRow icon={FiUser} label="Account Profile" description="Update your name and login details" action={() => setModal('profile')} />
        <SettingRow icon={FiLock} label="Change Password" description="Update your admin password" action={() => setModal('password')} />
        <SettingRow icon={FiShield} label="Security Settings" description="Two-factor auth and session management" action={() => setModal('security')} />
        <SettingRow icon={FiGlobe} label="Language & Region" description="Set timezone and language preferences" action={() => setModal('language')} />
        <SettingRow icon={FiDatabase} label="Data & Backup" description="Export your restaurant data as JSON" action={() => setModal('data')} badge="Export" />
        <SettingRow icon={FiMoon} label="Appearance" description="Theme, colors and display preferences" action={() => setModal('appearance')} color="#6366f1" badge="New" />
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard title="Danger Zone" icon={FiAlertCircle}>
        <div style={{ padding: 20 }}>
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>Clear All Data</p>
              <p style={{ margin: '2px 0 0', color: '#888', fontSize: '0.76rem' }}>Permanently delete all restaurant data. This cannot be undone.</p>
            </div>
            <button style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#dc2626', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Clear Data</button>
          </div>
        </div>
      </SectionCard>

      <div style={{ textAlign: 'center', padding: '10px 0 20px', color: '#bbb', fontSize: '0.78rem' }}>DineSmart v1.0 Ã‚Â· Restaurant Management System</div>

      {/* Modals */}
      {modal === 'profile' && <AccountProfileModal onClose={() => setModal(null)} />}
      {modal === 'password' && <ChangePasswordModal onClose={() => setModal(null)} />}
      {modal === 'security' && <SecurityModal onClose={() => setModal(null)} />}
      {modal === 'language' && <LanguageModal onClose={() => setModal(null)} />}
      {modal === 'data' && <DataBackupModal onClose={() => setModal(null)} />}
      {modal === 'appearance' && <AppearanceModal onClose={() => setModal(null)} />}
    </div>
  );
};

export default Settings;