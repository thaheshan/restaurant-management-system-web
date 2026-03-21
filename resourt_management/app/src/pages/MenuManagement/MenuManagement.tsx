"use client";

import { useState, useEffect } from 'react';
import './MenuManagement.scss';

const MenuManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [restaurantId, setRestaurantId] = useState('');
  const [token, setToken] = useState('');

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    ingredients: '',
    categoryId: '',
  });

  const API = 'http://localhost:8000/api';
//   const API_RESTAURANT = 'http://localhost:3002'; 

  // ← Load session on mount (fixes SSR localStorage issue)
  useEffect(() => {
    try {
      const session = localStorage.getItem('adminSession');
      if (session) {
        const parsed = JSON.parse(session);
        const rid = parsed.user?.restaurantId || parsed.restaurantId || '';
        const tok = parsed.token || '';
        console.log('Session loaded — restaurantId:', rid, 'token:', tok ? 'exists' : 'MISSING');
        setRestaurantId(rid);
        setToken(tok);
      } else {
        console.error('No adminSession found in localStorage');
        setError('Not logged in — please log in again');
      }
    } catch (e) {
      console.error('Session parse error:', e);
    }
  }, []);

  // ← Fetch categories once restaurantId is set
  useEffect(() => {
    if (restaurantId) {
      fetchCategories();
    }
  }, [restaurantId]);

  const fetchCategories = async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError('');
    try {
      console.log('Fetching categories for:', restaurantId);
      const res = await fetch(
        `${API}/restaurant/public/categories/${restaurantId}`
      );
      const data = await res.json();
      console.log('Categories response:', data);
      const cats = data.categories || [];

      const catsWithItems = await Promise.all(
        cats.map(async (cat: any) => {
          try {
            const itemRes = await fetch(
              `${API}/restaurant/public/category/${cat.id}/items`
            );
            const itemData = await itemRes.json();
            return { ...cat, items: itemData.items || [] };
          } catch {
            return { ...cat, items: [] };
          }
        })
      );
      setCategories(catsWithItems);
    } catch (err) {
      console.error('Fetch categories error:', err);
      setError('Failed to load menu. Make sure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      setError('Category name is required');
      return;
    }
    if (!restaurantId || !token) {
      setError('Session expired — please log in again');
      return;
    }
    setError('');
    try {
      console.log('Adding category:', { restaurantId, ...categoryForm });
      const res = await fetch(`${API}/restaurant/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          name: categoryForm.name,
          description: categoryForm.description,
        }),
      });
      const data = await res.json();
      console.log('Add category response:', data);

      if (data.success || data.categoryId) {
        setSuccess('Category added!');
        setShowCategoryModal(false);
        setCategoryForm({ name: '', description: '' });
        await fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add category');
      }
    } catch (err) {
      console.error('Add category error:', err);
      setError('Network error — check backend is running on port 8000');
    }
  };

  const handleAddItem = async () => {
    if (!itemForm.name.trim() || !itemForm.price || !itemForm.categoryId) {
      setError('Name, price and category are required');
      return;
    }
    if (!restaurantId || !token) {
      setError('Session expired — please log in again');
      return;
    }
    setError('');
    try {
      console.log('Adding item:', { restaurantId, ...itemForm });
      const res = await fetch(`${API}/restaurant/admin/menu-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          categoryId: itemForm.categoryId,
          name: itemForm.name,
          description: itemForm.description,
          price: parseFloat(itemForm.price),
          ingredients: itemForm.ingredients,
        }),
      });
      const data = await res.json();
      console.log('Add item response:', data);

      if (data.success || data.itemId) {
        setSuccess('Menu item added!');
        setShowItemModal(false);
        setItemForm({ name: '', description: '', price: '', ingredients: '', categoryId: '' });
        await fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add item');
      }
    } catch (err) {
      console.error('Add item error:', err);
      setError('Network error — check backend is running on port 8000');
    }
  };

  return (
    <div className="menu-mgmt">

      {success && <div className="menu-mgmt__toast menu-mgmt__toast--success">✓ {success}</div>}
      {error && <div className="menu-mgmt__toast menu-mgmt__toast--error">✗ {error}</div>}

      {/* Header */}
      <div className="menu-mgmt__header">
        <div>
          <h1 className="menu-mgmt__title">Menu Management</h1>
          <p className="menu-mgmt__subtitle">Manage your restaurant categories and menu items</p>
        </div>
        <div className="menu-mgmt__actions">
          <button className="menu-mgmt__btn-secondary" onClick={() => { setError(''); setShowCategoryModal(true); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Category
          </button>
          <button className="menu-mgmt__btn-primary" onClick={() => { setError(''); setShowItemModal(true); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="menu-mgmt__stats">
        <div className="menu-mgmt__stat">
          <span className="menu-mgmt__stat-value">{categories.length}</span>
          <span className="menu-mgmt__stat-label">Categories</span>
        </div>
        <div className="menu-mgmt__stat">
          <span className="menu-mgmt__stat-value">
            {categories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0)}
          </span>
          <span className="menu-mgmt__stat-label">Total Items</span>
        </div>
        <div className="menu-mgmt__stat">
          <span className="menu-mgmt__stat-value">
            {categories.reduce((acc, cat) => acc + (cat.items?.filter((i: any) => i.is_available).length || 0), 0)}
          </span>
          <span className="menu-mgmt__stat-label">Active Items</span>
        </div>
        {/* Debug info — remove after testing */}
        <div className="menu-mgmt__stat" style={{ background: '#fff3cd' }}>
          <span className="menu-mgmt__stat-value" style={{ fontSize: '0.7rem', color: '#856404' }}>
            {restaurantId ? restaurantId.slice(0, 8) + '...' : 'NO ID'}
          </span>
          <span className="menu-mgmt__stat-label">Restaurant ID</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="menu-mgmt__loading">
          <div className="menu-mgmt__spinner" />
          <span>Loading menu...</span>
        </div>
      )}

      {/* Categories */}
      {!loading && (
        <div className="menu-mgmt__body">
          {categories.length === 0 ? (
            <div className="menu-mgmt__empty">
              <div className="menu-mgmt__empty-icon">🍽</div>
              <h3>No categories yet</h3>
              <p>Start by adding a category like Rice, Pasta or Burgers</p>
              <button className="menu-mgmt__btn-primary" onClick={() => setShowCategoryModal(true)}>
                + Add First Category
              </button>
            </div>
          ) : (
            categories.map((cat: any) => (
              <div key={cat.id} className="menu-mgmt__category">
                <div className="menu-mgmt__category-header">
                  <div className="menu-mgmt__category-left">
                    <div className="menu-mgmt__category-icon">
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="menu-mgmt__category-name">{cat.name}</h3>
                      <p className="menu-mgmt__category-desc">{cat.description}</p>
                    </div>
                  </div>
                  <div className="menu-mgmt__category-right">
                    <span className="menu-mgmt__category-count">
                      {cat.items?.length || 0} items
                    </span>
                    <button
                      className="menu-mgmt__add-item-btn"
                      onClick={() => {
                        setItemForm({ ...itemForm, categoryId: cat.id });
                        setShowItemModal(true);
                      }}
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                <div className="menu-mgmt__items">
                  {cat.items && cat.items.length > 0 ? (
                    cat.items.map((item: any) => (
                      <div key={item.id} className="menu-mgmt__item">
                        <div className="menu-mgmt__item-emoji">🍴</div>
                        <div className="menu-mgmt__item-info">
                          <span className="menu-mgmt__item-name">{item.name}</span>
                          <span className="menu-mgmt__item-desc">{item.description}</span>
                          {item.ingredients && (
                            <span className="menu-mgmt__item-ingredients">🧂 {item.ingredients}</span>
                          )}
                        </div>
                        <div className="menu-mgmt__item-right">
                          <span className="menu-mgmt__item-price">
                            Rs. {parseFloat(item.price).toLocaleString()}
                          </span>
                          <span className={`menu-mgmt__item-badge ${item.is_available ? 'active' : 'inactive'}`}>
                            {item.is_available ? '✓ Active' : '✗ Inactive'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="menu-mgmt__no-items">
                      <span>No items yet</span>
                      <button onClick={() => {
                        setItemForm({ ...itemForm, categoryId: cat.id });
                        setShowItemModal(true);
                      }}>
                        Add first item →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="menu-mgmt__overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="menu-mgmt__modal" onClick={e => e.stopPropagation()}>
            <div className="menu-mgmt__modal-header">
              <h3>Add Category</h3>
              <button onClick={() => setShowCategoryModal(false)}>✕</button>
            </div>
            <div className="menu-mgmt__modal-body">
              <div className="menu-mgmt__field">
                <label>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rice, Pasta, Burgers"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="menu-mgmt__field">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Main rice dishes"
                  value={categoryForm.description}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
            </div>
            <div className="menu-mgmt__modal-footer">
              <button className="menu-mgmt__btn-secondary" onClick={() => setShowCategoryModal(false)}>Cancel</button>
              <button className="menu-mgmt__btn-primary" onClick={handleAddCategory}>Add Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showItemModal && (
        <div className="menu-mgmt__overlay" onClick={() => setShowItemModal(false)}>
          <div className="menu-mgmt__modal" onClick={e => e.stopPropagation()}>
            <div className="menu-mgmt__modal-header">
              <h3>Add Menu Item</h3>
              <button onClick={() => setShowItemModal(false)}>✕</button>
            </div>
            <div className="menu-mgmt__modal-body">
              <div className="menu-mgmt__field">
                <label>Category *</label>
                <select
                  value={itemForm.categoryId}
                  onChange={e => setItemForm({ ...itemForm, categoryId: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="menu-mgmt__field">
                <label>Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken Biryani"
                  value={itemForm.name}
                  onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="menu-mgmt__field">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Aromatic basmati rice with spiced chicken"
                  value={itemForm.description}
                  onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                />
              </div>
              <div className="menu-mgmt__field">
                <label>Ingredients</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken, Rice, Spices"
                  value={itemForm.ingredients}
                  onChange={e => setItemForm({ ...itemForm, ingredients: e.target.value })}
                />
              </div>
              <div className="menu-mgmt__field">
                <label>Price (Rs.) *</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={itemForm.price}
                  onChange={e => setItemForm({ ...itemForm, price: e.target.value })}
                />
              </div>
            </div>
            <div className="menu-mgmt__modal-footer">
              <button className="menu-mgmt__btn-secondary" onClick={() => setShowItemModal(false)}>Cancel</button>
              <button className="menu-mgmt__btn-primary" onClick={handleAddItem}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;