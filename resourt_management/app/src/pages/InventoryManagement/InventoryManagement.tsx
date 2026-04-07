'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/src/store/hooks';
import { fetchInventory, fetchInventoryStats, addIngredient, updateIngredient, updateUsage, deleteIngredient, clearInventoryMessages } from '@/app/src/store/slices/inventorySlice';
import { FiPackage, FiCheckCircle, FiAlertTriangle, FiAlertOctagon, FiRefreshCw, FiPlus, FiSearch, FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown, FiX } from 'react-icons/fi';
import { GiMeat, GiFishCooked, GiCarrot, GiChiliPepper, GiCorn, GiMilkCarton } from 'react-icons/gi';

import './InventoryManagement.scss';

const P = '#2d5a3d';

const CAT_COLORS: Record<string, string> = {
  MEAT: '#e74c3c', SEAFOOD: '#2980b9', VEGETABLE: '#27ae60',
  SPICE: '#f39c12', DAIRY: '#8e44ad', GRAIN: '#d35400', OTHER: '#718096',
};

const CatIcon = ({ cat, size = 16 }: { cat: string; size?: number }) => {
  const props = { size, color: CAT_COLORS[cat] || '#718096' };
  if (cat === 'MEAT') return <GiMeat {...props} />;
  if (cat === 'SEAFOOD') return <GiFishCooked {...props} />;
  if (cat === 'VEGETABLE') return <GiCarrot {...props} />;
  if (cat === 'SPICE') return <GiChiliPepper {...props} />;
  if (cat === 'GRAIN') return <GiCorn {...props} />;
  if (cat === 'DAIRY') return <GiMilkCarton {...props} />;
  return <FiPackage {...props} />;
};

const getSession = () => {
  try {
    const s = localStorage.getItem('adminSession');
    if (s) { const p = JSON.parse(s); return { restaurantId: p.user?.restaurantId || p.restaurantId || '', token: p.token || ''}; }
  } catch {}
  return { restaurantId: '', token: '' };
};

const EMPTY_FORM = { name: '', category: 'MEAT', unit: 'kg', quantity: '', minThreshold: '', expiryDate: '' };

const InventoryManagement = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, successMessage } = useAppSelector(s => s.inventory);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageItem, setUsageItem] = useState<any>(null);
  const [usageAmount, setUsageAmount] = useState('');
  const [usageType, setUsageType] = useState<'add' | 'remove'>('remove');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  useEffect(() => {
    const { restaurantId } = getSession();
    if (restaurantId) { dispatch(fetchInventory(restaurantId)); dispatch(fetchInventoryStats(restaurantId)); }
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const { restaurantId } = getSession();
      dispatch(fetchInventory(restaurantId)); dispatch(fetchInventoryStats(restaurantId));
      setShowAddModal(false); setShowEditModal(false); setShowUsageModal(false); setShowDeleteConfirm(false);
      setForm(EMPTY_FORM);
      setTimeout(() => dispatch(clearInventoryMessages()), 3000);
    }
  }, [successMessage, dispatch]);

  const handleAdd = () => {
    const { restaurantId } = getSession();
    if (!form.name || !form.quantity) return;
    dispatch(addIngredient({ restaurantId, name: form.name, category: form.category, quantity: parseFloat(form.quantity), unit: form.unit, minThreshold: parseFloat(form.minThreshold || '0'), expiryDate: form.expiryDate || '2026-12-31' }));
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setEditForm({ name: item.name, category: (item.category || 'OTHER').toUpperCase(), unit: item.unit || 'kg', quantity: String(item.quantity || 0), minThreshold: String(parseFloat(item.reorder_level || item.min_threshold || 0)), expiryDate: item.expiry_date ? item.expiry_date.split('T')[0] : '' });
    setShowEditModal(true);
  };

  const handleEdit = () => {
    if (!editingItem) return;
    dispatch(updateIngredient({ id: editingItem.id, data: { quantity: parseFloat(editForm.quantity), expiryDate: editForm.expiryDate, status: 'fresh', name: editForm.name, category: editForm.category, unit: editForm.unit, minThreshold: parseFloat(editForm.minThreshold || '0') } }));
  };

  const openUsage = (item: any) => { setUsageItem(item); setUsageAmount(''); setUsageType('remove'); setShowUsageModal(true); };
  const handleUsage = () => { if (!usageItem || !usageAmount) return; dispatch(updateUsage({ id: usageItem.id, amount: parseFloat(usageAmount), type: usageType })); };

  const filtered = items.filter((i: any) => {
    const matchSearch = i.name?.toLowerCase().includes(search.toLowerCase());
    const qty = parseFloat(i.quantity ?? 0);
    let sl = 'ok';
    if (qty <= 0) sl = 'critical';
    else if (qty < 2) sl = 'low';
    
    const matchStatus = filterStatus === 'all' || filterStatus === sl;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: items.length,
    inStock: items.filter((i: any) => parseFloat(i.quantity ?? 0) >= 2).length,
    lowStock: items.filter((i: any) => { const qty = parseFloat(i.quantity ?? 0); return qty > 0 && qty < 2; }).length,
    critical: items.filter((i: any) => parseFloat(i.quantity ?? 0) <= 0).length,
  };

  const modalStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
  const cardStyle: React.CSSProperties = { background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 500, overflow: 'hidden' };
  const mHeader: React.CSSProperties = { padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  const mBody: React.CSSProperties = { padding: 24, display: 'flex', flexDirection: 'column', gap: 14 };
  const mFooter: React.CSSProperties = { padding: '0 24px 24px', display: 'flex', gap: 10 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: 5 };
  const btnPrimary: React.CSSProperties = { flex: 1, padding: 12, background: P, border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', color: 'white' };
  const btnGhost: React.CSSProperties = { flex: 1, padding: 12, background: '#f3f4f6', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', color: '#374151' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {successMessage && (
        <div style={{ background: 'rgba(45,90,61,0.08)', border: '1px solid rgba(45,90,61,0.2)', color: P, padding: '10px 16px', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiCheckCircle size={15} /> {successMessage}
        </div>
      )}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', padding: '10px 16px', borderRadius: 8 }}>{error}</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Inventory Management</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>Track and manage your kitchen ingredients</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { const {restaurantId} = getSession(); dispatch(fetchInventory(restaurantId)); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${P}`, borderRadius: 8, background: 'white', color: P, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, background: P, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            <FiPlus size={15} /> Add Ingredient
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Items', value: counts.total, color: P, bg: 'rgba(45,90,61,0.08)', Icon: FiPackage },
          { label: 'In Stock', value: counts.inStock, color: '#27ae60', bg: 'rgba(39,174,96,0.08)', Icon: FiCheckCircle },
          { label: 'Low Stock', value: counts.lowStock, color: '#f39c12', bg: 'rgba(243,156,18,0.08)', Icon: FiAlertTriangle },
          { label: 'Critical', value: counts.critical, color: '#e74c3c', bg: 'rgba(231,76,60,0.08)', Icon: FiAlertOctagon },
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

      {/* Table Card */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: '#f9fafb', borderRadius: 8, padding: '8px 14px', border: '1px solid #e5e7eb' }}>
            <FiSearch size={15} color="#9ca3af" />
            <input type="text" placeholder="Search ingredients..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', color: '#1a1a1a', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ key: 'all', label: 'All' }, { key: 'ok', label: 'In Stock' }, { key: 'low', label: 'Low Stock' }, { key: 'critical', label: 'Critical' }].map(f => (
              <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                border: filterStatus === f.key ? `1.5px solid ${P}` : '1px solid #e5e7eb',
                background: filterStatus === f.key ? P : 'white', color: filterStatus === f.key ? 'white' : '#555',
              }}>{f.label}</button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading inventory...</div>}

        {!loading && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['Ingredient', 'Category', 'Stock', 'Min Threshold', 'Expiry', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any) => {
                  const qty = parseFloat(item.quantity ?? 0);
                  let sl = 'ok';
                  if (qty <= 0) sl = 'critical';
                  else if (qty < 2) sl = 'low';
                  
                  const category = (item.category || 'OTHER').toUpperCase();
                  const threshold = parseFloat(item.reorder_level || item.min_threshold || 0);
                  const maxBar = Math.max(qty, threshold * 2, 10);
                  const expiry = item.expiry_date ? item.expiry_date.split('T')[0] : '-';
                  const barColor = sl === 'ok' ? '#27ae60' : sl === 'low' ? '#f39c12' : '#e74c3c';
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${CAT_COLORS[category] || '#718096'}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CatIcon cat={category} size={16} />
                          </div>
                          <span style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>{item.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, background: `${CAT_COLORS[category] || '#718096'}14`, color: CAT_COLORS[category] || '#718096', fontSize: '0.73rem', fontWeight: 700 }}>{category}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{qty} {item.unit || 'kg'}</span>
                          <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, marginTop: 4, width: 80 }}>
                            <div style={{ height: '100%', borderRadius: 2, background: barColor, width: `${Math.min((qty / maxBar) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.85rem' }}>{threshold} {item.unit || 'kg'}</td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.83rem' }}>{expiry}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, 
                          background: sl === 'ok' ? 'rgba(39,174,96,0.1)' : sl === 'low' ? 'rgba(243,156,18,0.1)' : 'rgba(231,76,60,0.1)', 
                          color: sl === 'ok' ? '#27ae60' : sl === 'low' ? '#f39c12' : '#e74c3c', 
                          display: 'inline-flex', alignItems: 'center', gap: 4 
                        }}>
                          {sl === 'ok' ? <FiCheckCircle size={11} /> : sl === 'low' ? <FiAlertTriangle size={11} /> : <FiAlertOctagon size={11} />}
                          {sl === 'ok' ? 'In Stock' : sl === 'low' ? 'Low Stock' : 'Critical'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openUsage(item)} title="Update Stock" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, background: 'rgba(45,90,61,0.08)', border: 'none', color: P, fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                            <FiTrendingUp size={13} /> Update
                          </button>
                          <button onClick={() => openEdit(item)} title="Edit" style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(59,130,246,0.08)', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => { setDeleteTarget(item); setShowDeleteConfirm(true); }} title="Delete" style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
                <FiSearch size={32} color="#d1d5db" style={{ marginBottom: 8 }} />
                <p style={{ margin: 0 }}>No ingredients found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={modalStyle} onClick={() => setShowAddModal(false)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <div style={mHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}><FiPlus size={18} /></div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Add Ingredient</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            <div style={mBody}>
              <div style={{ background: 'rgba(45,90,61,0.06)', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', color: P }}>
                💡 If the ingredient already exists, stock will be added to it.
              </div>
              <div><label style={labelStyle}>Name *</label><input style={inputStyle} type="text" placeholder="e.g. Chicken Breast" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {['MEAT','SEAFOOD','VEGETABLE','SPICE','DAIRY','GRAIN','OTHER'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Unit</label>
                  <select style={inputStyle} value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                    {['kg','g','L','ml','pcs'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Quantity *</label><input style={inputStyle} type="number" placeholder="0" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
                <div><label style={labelStyle}>Min Threshold</label><input style={inputStyle} type="number" placeholder="0" value={form.minThreshold} onChange={e => setForm({...form, minThreshold: e.target.value})} /></div>
              </div>
              <div><label style={labelStyle}>Expiry Date</label><input style={inputStyle} type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} /></div>
            </div>
            <div style={mFooter}>
              <button style={btnGhost} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button style={btnPrimary} onClick={handleAdd} disabled={loading}>{loading ? 'Saving...' : 'Add Ingredient'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div style={modalStyle} onClick={() => setShowEditModal(false)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <div style={mHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><FiEdit2 size={16} /></div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Edit Ingredient</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            <div style={mBody}>
              <div><label style={labelStyle}>Name</label><input style={inputStyle} type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                    {['MEAT','SEAFOOD','VEGETABLE','SPICE','DAIRY','GRAIN','OTHER'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Unit</label>
                  <select style={inputStyle} value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}>
                    {['kg','g','L','ml','pcs'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Quantity</label><input style={inputStyle} type="number" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} /></div>
                <div><label style={labelStyle}>Min Threshold</label><input style={inputStyle} type="number" value={editForm.minThreshold} onChange={e => setEditForm({...editForm, minThreshold: e.target.value})} /></div>
              </div>
              <div><label style={labelStyle}>Expiry Date</label><input style={inputStyle} type="date" value={editForm.expiryDate} onChange={e => setEditForm({...editForm, expiryDate: e.target.value})} /></div>
            </div>
            <div style={mFooter}>
              <button style={btnGhost} onClick={() => setShowEditModal(false)}>Cancel</button>
              <button style={btnPrimary} onClick={handleEdit} disabled={loading}>{loading ? 'Saving...' : 'Update Ingredient'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Modal */}
      {showUsageModal && usageItem && (
        <div style={modalStyle} onClick={() => setShowUsageModal(false)}>
          <div style={{ ...cardStyle, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div style={mHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}><FiTrendingUp size={16} /></div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Daily Stock Update</h3>
              </div>
              <button onClick={() => setShowUsageModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            <div style={mBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${CAT_COLORS[(usageItem.category || 'OTHER').toUpperCase()] || '#718096'}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CatIcon cat={(usageItem.category || 'OTHER').toUpperCase()} size={16} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem' }}>{usageItem.name}</p>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>Current: {usageItem.quantity} {usageItem.unit}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { type: 'remove' as const, label: 'Remove / Used', Icon: FiTrendingDown, color: '#e74c3c' },
                  { type: 'add' as const, label: 'Add / Restock', Icon: FiTrendingUp, color: P },
                ].map(btn => (
                  <button key={btn.type} onClick={() => setUsageType(btn.type)} style={{
                    padding: '10px', borderRadius: 10, border: usageType === btn.type ? `2px solid ${btn.color}` : '1px solid #e5e7eb',
                    background: usageType === btn.type ? `${btn.color}10` : 'white', color: btn.color,
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <btn.Icon size={14} /> {btn.label}
                  </button>
                ))}
              </div>
              <div>
                <label style={labelStyle}>Amount ({usageItem.unit})</label>
                <input style={inputStyle} type="number" placeholder="0" value={usageAmount} onChange={e => setUsageAmount(e.target.value)} autoFocus />
              </div>
              {usageAmount && (
                <div style={{ padding: '10px 14px', background: 'rgba(45,90,61,0.06)', borderRadius: 8, fontSize: '0.85rem', color: P, fontWeight: 600 }}>
                  New stock: <strong>
                    {usageType === 'remove'
                      ? Math.max(0, parseFloat(usageItem.quantity) - parseFloat(usageAmount)).toFixed(2)
                      : (parseFloat(usageItem.quantity) + parseFloat(usageAmount)).toFixed(2)
                    } {usageItem.unit}
                  </strong>
                </div>
              )}
            </div>
            <div style={mFooter}>
              <button style={btnGhost} onClick={() => setShowUsageModal(false)}>Cancel</button>
              <button style={{ ...btnPrimary, background: usageType === 'remove' ? '#dc2626' : P }} onClick={handleUsage} disabled={!usageAmount}>
                {usageType === 'remove' ? 'Remove Stock' : 'Add Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && deleteTarget && (
        <div style={modalStyle} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ ...cardStyle, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={mHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}><FiTrash2 size={16} /></div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Delete Ingredient</h3>
              </div>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <p style={{ color: '#444', fontSize: '0.9rem', margin: 0 }}>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
            </div>
            <div style={mFooter}>
              <button style={btnGhost} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button style={{ ...btnPrimary, background: '#dc2626' }} onClick={() => dispatch(deleteIngredient(deleteTarget.id))}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;

