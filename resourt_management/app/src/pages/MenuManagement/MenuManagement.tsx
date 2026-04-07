'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiRefreshCw, FiTag, FiCheckCircle, FiAlertTriangle, FiUpload, FiImage, FiLoader } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import './MenuManagement.scss';

const P = '#2d5a3d';
const API = 'http://localhost:8000/api';

const getSession = () => {
  try {
    const session = localStorage.getItem('adminSession');
    if (session) { const parsed = JSON.parse(session); return { restaurantId: parsed.user?.restaurantId || parsed.restaurantId || '', token: parsed.token || '' }; }
  } catch {}
  return { restaurantId: '', token: '' };
};

// ─── Image Upload Dropzone ────────────────────────────────────────────────────
interface ImageUploadProps {
  value: string;       // Supabase public URL (or '' if none)
  onChange: (url: string) => void;
  label?: string;
}

const ImageUpload = ({ value, onChange, label = 'Image' }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be under 5MB.'); return; }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API}/upload/image?bucket=menu-images&folder=menu`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || 'Upload failed. Check backend is running.');
      }
    } catch {
      setUploadError('Network error. Make sure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const zoneStyle: React.CSSProperties = {
    border: `2px dashed ${dragging ? P : uploading ? '#f59e0b' : '#d1d5db'}`,
    borderRadius: 12,
    background: dragging ? 'rgba(45,90,61,0.04)' : uploading ? 'rgba(245,158,11,0.04)' : '#fafafa',
    cursor: uploading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <div>
      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.3px', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div
        style={zoneStyle}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {value ? (
          <div style={{ position: 'relative' }}>
            <img src={value} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
            {!uploading && (
              <button
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                <FiX size={13} />
              </button>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.45)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, color: 'white', fontSize: '0.75rem' }}>
              <FiImage size={12} /> {uploading ? 'Replacing...' : 'Click or drag to change'}
            </div>
          </div>
        ) : (
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: uploading ? 'rgba(245,158,11,0.1)' : 'rgba(45,90,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: uploading ? '#f59e0b' : P }}>
              {uploading ? <FiLoader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <FiUpload size={20} />}
            </div>
            <p style={{ margin: 0, fontWeight: 600, color: '#374151', fontSize: '0.85rem' }}>
              {uploading ? 'Uploading to Supabase...' : dragging ? 'Drop image here' : 'Click or drag to upload'}
            </p>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} disabled={uploading} />
      </div>
      {uploadError && (
        <p style={{ margin: '6px 0 0', color: '#dc2626', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiAlertTriangle size={12} /> {uploadError}
        </p>
      )}
      {value && !uploading && (
        <p style={{ margin: '4px 0 0', color: '#16a34a', fontSize: '0.72rem', wordBreak: 'break-all' }}>
          ✓ Saved to Supabase Storage
        </p>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MenuManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [token, setToken] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'category' | 'item'; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' });
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', ingredients: '', categoryId: '', is_available: true, image: '' });

  useEffect(() => {
    const { restaurantId: rid, token: tok } = getSession();
    setRestaurantId(rid); setToken(tok);
  }, []);

  useEffect(() => { if (restaurantId) fetchCategories(); }, [restaurantId]);

  const fetchCategories = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/restaurant/public/categories/${restaurantId}`);
      const data = await res.json();
      const cats = data.categories || [];
      const catsWithItems = await Promise.all(cats.map(async (cat: any) => {
        try {
          const itemRes = await fetch(`${API}/restaurant/public/category/${cat.id}/items`);
          const itemData = await itemRes.json();
          const items = itemData.items || [];
          console.log(`Fetched items for category ${cat.id}:`, items);
          return { ...cat, items: items };
        } catch { return { ...cat, items: [] }; }
      }));
      setCategories(catsWithItems);
    } catch { setError('Failed to load menu. Make sure backend is running.'); }
    finally { setLoading(false); }
  };

  const showSuccessMsg = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const openAddCategory = () => { setEditingCategory(null); setCategoryForm({ name: '', description: '', image: '' }); setError(''); setShowCategoryModal(true); };
  const openEditCategory = (cat: any) => { setEditingCategory(cat); setCategoryForm({ name: cat.name, description: cat.description || '', image: cat.image_url || '' }); setError(''); setShowCategoryModal(true); };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) { setError('Category name is required'); return; }
    setError('');
    try {
      const url = editingCategory ? `${API}/restaurant/admin/categories/${editingCategory.id}` : `${API}/restaurant/admin/categories`;
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId, name: categoryForm.name, description: categoryForm.description, image: categoryForm.image || null })
      });
      const data = await res.json();
      if (data.success || data.categoryId || data.category) { showSuccessMsg(editingCategory ? 'Category updated!' : 'Category added!'); setShowCategoryModal(false); await fetchCategories(); }
      else setError(data.error || 'Failed to save category');
    } catch { setError('Network error'); }
  };

  const openAddItem = (categoryId = '') => { setEditingItem(null); setItemForm({ name: '', description: '', price: '', ingredients: '', categoryId, is_available: true, image: '' }); setError(''); setShowItemModal(true); };
  const openEditItem = (item: any, categoryId: string) => {
    setEditingItem(item);
    setItemForm({ name: item.name, description: item.description || '', price: String(item.price), ingredients: item.ingredients || '', categoryId, is_available: item.is_available !== false, image: item.image_url || '' });
    setError(''); setShowItemModal(true);
  };

  const handleSaveItem = async () => {
    if (!itemForm.name.trim() || !itemForm.price || !itemForm.categoryId) { setError('Name, price and category are required'); return; }
    setError('');
    try {
      const url = editingItem ? `${API}/restaurant/admin/menu-items/${editingItem.id}` : `${API}/restaurant/admin/menu-items`;
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId, categoryId: itemForm.categoryId, name: itemForm.name, description: itemForm.description, price: parseFloat(itemForm.price), ingredients: itemForm.ingredients, is_available: itemForm.is_available, image: itemForm.image || null })
      });
      const data = await res.json();
      if (data.success || data.itemId || data.item) { showSuccessMsg(editingItem ? 'Item updated!' : 'Item added!'); setShowItemModal(false); await fetchCategories(); }
      else setError(data.error || 'Failed to save item');
    } catch { setError('Network error'); }
  };

  const confirmDelete = (id: string, type: 'category' | 'item', name: string) => { setDeleteTarget({ id, type, name }); setError(''); setShowDeleteConfirm(true); };
  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try {
      const url = deleteTarget.type === 'category' ? `${API}/restaurant/admin/categories/${deleteTarget.id}` : `${API}/restaurant/admin/menu-items/${deleteTarget.id}`;
      const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { showSuccessMsg(`${deleteTarget.type === 'category' ? 'Category' : 'Item'} deleted!`); setShowDeleteConfirm(false); setDeleteTarget(null); await fetchCategories(); }
      else setError(data.error || 'Failed to delete');
    } catch { setError('Network error'); }
    finally { setDeleting(false); }
  };

  const handleToggleAvailable = async (item: any, newStatus: boolean) => {
    console.log(`Toggling availability for ${item.name}: ${item.is_available} -> ${newStatus}`);
    
    // Optimistic Update
    const originalCategories = [...categories];
    const updatedCategories = categories.map(cat => ({
      ...cat,
      items: cat.items.map((i: any) => i.id === item.id ? { ...i, is_available: newStatus } : i)
    }));
    setCategories(updatedCategories);

    try {
      const payload = {
        name: item.name,
        description: item.description || '',
        price: parseFloat(item.price),
        ingredients: item.ingredients || '',
        is_available: newStatus,
        image: null // Let COALESCE handle this in backend
      };

      const res = await fetch(`${API}/restaurant/admin/menu-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      console.log('Update response:', data);
      
      if (data.success) { 
        showSuccessMsg(`'${item.name}' is now ${newStatus ? 'available' : 'unavailable'}`); 
        // Sync with server completely
        await fetchCategories(); 
      } else {
        setCategories(originalCategories); // Rollback
        setError(data.error || 'Failed to update status');
      }
    } catch (err) { 
      console.error('Update error:', err);
      setCategories(originalCategories); // Rollback
      setError('Network error'); 
    }
  };

  const totalItems = categories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  const activeItems = categories.reduce((acc, cat) => acc + (cat.items?.filter((i: any) => i.is_available).length || 0), 0);

  const modalStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
  const cardStyle: React.CSSProperties = { background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 520, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' };
  const mHeader: React.CSSProperties = { padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 };
  const mBody: React.CSSProperties = { padding: 24, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' };
  const mFooter: React.CSSProperties = { padding: '0 24px 24px', display: 'flex', gap: 10, flexShrink: 0 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.3px', display: 'block', marginBottom: 5 };
  const btnPrimary: React.CSSProperties = { flex: 1, padding: 12, background: P, border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', color: 'white' };
  const btnGhost: React.CSSProperties = { flex: 1, padding: 12, background: '#f3f4f6', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', color: '#374151' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {success && (
        <div style={{ background: 'rgba(45,90,61,0.08)', border: '1px solid rgba(45,90,61,0.2)', color: P, padding: '10px 16px', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiCheckCircle size={15} /> {success}
        </div>
      )}
      {error && !showCategoryModal && !showItemModal && !showDeleteConfirm && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', padding: '10px 16px', borderRadius: 8 }}>{error}</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Menu Management</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>Manage categories and menu items</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchCategories} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${P}`, borderRadius: 8, background: 'white', color: P, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={openAddCategory} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${P}`, borderRadius: 8, background: 'white', color: P, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            <FiTag size={14} /> Add Category
          </button>
          <button onClick={() => openAddItem()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, background: P, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            <FiPlus size={15} /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Categories', value: categories.length, color: P, bg: 'rgba(45,90,61,0.08)', Icon: FiTag },
          { label: 'Total Items', value: totalItems, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', Icon: MdRestaurantMenu },
          { label: 'Active Items', value: activeItems, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', Icon: FiCheckCircle },
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

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading menu...</div>}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed #e5e7eb', borderRadius: 16 }}>
              <MdRestaurantMenu size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
              <p style={{ fontWeight: 700, color: '#374151', margin: '0 0 4px' }}>No categories yet</p>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 16px' }}>Start by adding a category</p>
              <button onClick={openAddCategory} style={{ padding: '10px 24px', background: P, color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FiPlus size={15} /> Add First Category
              </button>
            </div>
          ) : categories.map((cat: any) => (
            <div key={cat.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: cat.items?.length > 0 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P, fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '1rem' }}>{cat.name}</h3>
                    {cat.description && <p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>{cat.description}</p>}
                    <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(45,90,61,0.08)', color: P, fontSize: '0.72rem', fontWeight: 600 }}>{cat.items?.length || 0} items</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => openAddItem(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: `1px solid ${P}`, borderRadius: 8, background: 'white', color: P, fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                    <FiPlus size={12} /> Add Item
                  </button>
                  <button onClick={() => openEditCategory(cat)} style={{ padding: '7px', borderRadius: 8, background: 'rgba(59,130,246,0.08)', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => confirmDelete(cat.id, 'category', cat.name)} style={{ padding: '7px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              {cat.items?.length > 0 && (
                <div style={{ padding: '8px 12px 12px' }}>
                  {cat.items.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, marginTop: 4, background: '#fafafa', border: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0 }}>
                            <FiImage size={18} />
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.88rem' }}>{item.name}</span>
                            <select 
                              value={item.is_available ? 'true' : 'false'} 
                              onChange={(e) => handleToggleAvailable(item, e.target.value === 'true')}
                              style={{ 
                                padding: '2px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, 
                                background: item.is_available ? 'rgba(34,197,94,0.1)' : 'rgba(156,163,175,0.15)', 
                                color: item.is_available ? '#16a34a' : '#9ca3af',
                                border: 'none', cursor: 'pointer', outline: 'none',
                                appearance: 'none', textAlign: 'center'
                              }}
                            >
                              <option value="true">Available</option>
                              <option value="false">Unavailable</option>
                            </select>
                          </div>
                          {item.description && <p style={{ margin: 0, color: '#888', fontSize: '0.75rem' }}>{item.description}</p>}
                          {item.ingredients && <p style={{ margin: 0, color: '#aaa', fontSize: '0.72rem' }}>Ingredients: {item.ingredients}</p>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ fontWeight: 800, color: P, fontSize: '0.95rem' }}>LKR {parseFloat(item.price).toFixed(2)}</span>
                        <button onClick={() => openEditItem(item, cat.id)} style={{ padding: '6px', borderRadius: 7, background: 'rgba(59,130,246,0.08)', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => confirmDelete(item.id, 'item', item.name)} style={{ padding: '6px', borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Category Modal ── */}
      {showCategoryModal && (
        <div style={modalStyle} onClick={() => setShowCategoryModal(false)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <div style={mHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}><FiTag size={16} /></div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              </div>
              <button onClick={() => setShowCategoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            {error && <div style={{ margin: '0 24px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', borderRadius: 8, fontSize: '0.85rem' }}>{error}</div>}
            <div style={mBody}>
              <ImageUpload label="Category Image (optional)" value={categoryForm.image} onChange={(url) => setCategoryForm({ ...categoryForm, image: url })} />
              <div><label style={labelStyle}>Category Name *</label><input style={inputStyle} type="text" placeholder="e.g. Rice, Burgers, Drinks" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} /></div>
              <div><label style={labelStyle}>Description</label><input style={inputStyle} type="text" placeholder="Optional description" value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} /></div>
            </div>
            <div style={mFooter}>
              <button style={btnGhost} onClick={() => setShowCategoryModal(false)}>Cancel</button>
              <button style={btnPrimary} onClick={handleSaveCategory}>{editingCategory ? 'Update Category' : 'Add Category'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Item Modal ── */}
      {showItemModal && (
        <div style={modalStyle} onClick={() => setShowItemModal(false)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <div style={mHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}><MdRestaurantMenu size={18} /></div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              </div>
              <button onClick={() => setShowItemModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            {error && <div style={{ margin: '0 24px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', borderRadius: 8, fontSize: '0.85rem' }}>{error}</div>}
            <div style={mBody}>
              <ImageUpload label="Item Image (optional)" value={itemForm.image} onChange={(url) => setItemForm({ ...itemForm, image: url })} />
              <div><label style={labelStyle}>Item Name *</label><input style={inputStyle} type="text" placeholder="e.g. Chicken Fried Rice" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} /></div>
              <div><label style={labelStyle}>Description</label><input style={inputStyle} type="text" placeholder="Optional" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Price (LKR) *</label><input style={inputStyle} type="number" placeholder="450" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: e.target.value})} /></div>
                <div><label style={labelStyle}>Category *</label>
                  <select style={inputStyle} value={itemForm.categoryId} onChange={e => setItemForm({...itemForm, categoryId: e.target.value})}>
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Ingredients</label><input style={inputStyle} type="text" placeholder="e.g. Chicken, Rice, Egg" value={itemForm.ingredients} onChange={e => setItemForm({...itemForm, ingredients: e.target.value})} /></div>
              <div>
                <label style={labelStyle}>Availability</label>
                <select 
                  style={inputStyle} 
                  value={itemForm.is_available ? 'true' : 'false'} 
                  onChange={e => setItemForm({...itemForm, is_available: e.target.value === 'true'})}
                >
                  <option value="true">Available for Ordering</option>
                  <option value="false">Unavailable / Sold Out</option>
                </select>
              </div>
            </div>
            <div style={mFooter}>
              <button style={btnGhost} onClick={() => setShowItemModal(false)}>Cancel</button>
              <button style={btnPrimary} onClick={handleSaveItem}>{editingItem ? 'Update Item' : 'Add Item'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {showDeleteConfirm && deleteTarget && (
        <div style={modalStyle} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ ...cardStyle, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={mHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}><FiTrash2 size={16} /></div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Confirm Delete</h3>
              </div>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: '16px 24px' }}>
              <p style={{ color: '#444', fontSize: '0.9rem', margin: 0 }}>Delete <strong>{deleteTarget.name}</strong>?</p>
              {deleteTarget.type === 'category' && <p style={{ color: '#e67e22', fontSize: '0.82rem', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}><FiAlertTriangle size={13} /> This will also delete all items in this category.</p>}
            </div>
            <div style={mFooter}>
              <button style={btnGhost} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button style={{ ...btnPrimary, background: '#dc2626' }} onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;