"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/src/store/hooks';
import {
  fetchInventory,
  fetchInventoryStats,
  addIngredient,
  deleteIngredient,
  clearInventoryMessages,
} from '@/app/src/store/slices/inventorySlice';
import './InventoryManagement.scss';

const categoryColors: Record<string, string> = {
  MEAT: '#e74c3c',
  SEAFOOD: '#2980b9',
  VEGETABLE: '#27ae60',
  SPICE: '#f39c12',
};

const categoryIcons: Record<string, string> = {
  MEAT: '🥩',
  SEAFOOD: '🦐',
  VEGETABLE: '🥬',
  SPICE: '🌶',
};

const InventoryManagement = () => {
  const dispatch = useAppDispatch();
  const { items, stats, loading, error, successMessage } = useAppSelector(
    (state) => state.inventory
  );

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    category: 'MEAT',
    unit: 'kg',
    quantity: '',
    minThreshold: '',
    expiryDate: '',
  });

  // Get restaurantId from session
  const getRestaurantId = () => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.user?.restaurantId || parsed.restaurantId || '';
    }
    return '';
  };

  useEffect(() => {
    const restaurantId = getRestaurantId();
    if (restaurantId) {
      dispatch(fetchInventory(restaurantId));
      dispatch(fetchInventoryStats(restaurantId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const restaurantId = getRestaurantId();
      dispatch(fetchInventory(restaurantId));
      dispatch(fetchInventoryStats(restaurantId));
      setShowModal(false);
      setForm({
        name: '',
        category: 'MEAT',
        unit: 'kg',
        quantity: '',
        minThreshold: '',
        expiryDate: '',
      });
      setTimeout(() => dispatch(clearInventoryMessages()), 3000);
    }
  }, [successMessage, dispatch]);

  const handleAddIngredient = async () => {
    const restaurantId = getRestaurantId();
    if (!form.name || !form.quantity || !form.minThreshold) return;

    dispatch(
      addIngredient({
        restaurantId,
        name: form.name,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        minThreshold: parseFloat(form.minThreshold),
        expiryDate: form.expiryDate || '2026-12-31',
      })
    );
  };

  const handleDelete = (id: string) => {
    dispatch(deleteIngredient(id));
  };

  const filtered = items.filter((i: any) => {
    const matchSearch = i.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const status = i.status || i.stock_level || 'ok';
    const matchStatus = filterStatus === 'all' || status === filterStatus;
    return matchSearch && matchStatus;
  });

  const computedStats = {
    total: stats?.total ?? items.length,
    inStock:
      stats?.inStock ??
      items.filter((i: any) => (i.status || i.stock_level) === 'ok').length,
    lowStock:
      stats?.lowStock ??
      items.filter((i: any) => (i.status || i.stock_level) === 'low').length,
    critical:
      stats?.critical ??
      items.filter(
        (i: any) => (i.status || i.stock_level) === 'critical'
      ).length,
    waste: '1.8%',
  };

  return (
    <div className="inventory">
      {/* Success Message */}
      {successMessage && (
        <div
          style={{
            background: '#e8f5ee',
            color: '#1e6e4e',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          ✓ {successMessage}
        </div>
      )}

      {/* Error Message */}
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
        </div>
      )}

      {/* Header */}
      <div className="inventory__header">
        <div>
          <h1 className="inventory__title">Inventory Management</h1>
          <p className="inventory__subtitle">
            Track and manage your kitchen ingredients
          </p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Ingredient
        </button>
      </div>

      {/* Stats */}
      <div className="inventory__stats">
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: 'rgba(30,110,78,0.1)', color: '#1e6e4e' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Ingredients Tracking</p>
            <p className="stat-card__value">{computedStats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: 'rgba(39,174,96,0.1)', color: '#27ae96' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="stat-card__label">In Stock</p>
            <p className="stat-card__value">{computedStats.inStock}</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: 'rgba(243,156,18,0.1)', color: '#f39c12' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Low Stock</p>
            <p className="stat-card__value">{computedStats.lowStock}</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Critical Stock</p>
            <p className="stat-card__value">{computedStats.critical}</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: 'rgba(41,128,185,0.1)', color: '#2980b9' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Wastage Rate</p>
            <p className="stat-card__value">{computedStats.waste}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="inventory__table-card">
        {/* Toolbar */}
        <div className="inventory__toolbar">
          <div className="search-box">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {['all', 'ok', 'low', 'critical'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filterStatus === f ? 'active' : ''}`}
                onClick={() => setFilterStatus(f)}
              >
                {f === 'all'
                  ? 'All'
                  : f === 'ok'
                  ? 'In Stock'
                  : f === 'low'
                  ? 'Low Stock'
                  : 'Critical'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            Loading inventory...
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="table-wrapper">
            <table className="ingredient-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any) => {
                  const status = item.status || item.stock_level || 'ok';
                  const category = item.category?.toUpperCase() || 'OTHER';
                  const stock = item.quantity ?? item.stock ?? 0;
                  const unit = item.unit || 'kg';
                  const threshold =
                    item.minThreshold ||
                    item.min_threshold ||
                    item.threshold ||
                    0;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="ingredient-name">
                          <span className="ingredient-icon">
                            {categoryIcons[category] || '📦'}
                          </span>
                          {item.name}
                        </div>
                      </td>
                      <td>
                        <span
                          className="category-badge"
                          style={{
                            background: `${
                              categoryColors[category] || '#718096'
                            }18`,
                            color: categoryColors[category] || '#718096',
                          }}
                        >
                          {category}
                        </span>
                      </td>
                      <td>
                        <div className="stock-info">
                          <span className="stock-value">
                            {stock} {unit}
                          </span>
                          <div className="stock-bar">
                            <div
                              className="stock-bar__fill"
                              style={{
                                width: `${Math.min(
                                  (parseFloat(stock) / 70) * 100,
                                  100
                                )}%`,
                                background:
                                  status === 'ok'
                                    ? '#27ae60'
                                    : status === 'low'
                                    ? '#f39c12'
                                    : '#e74c3c',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="threshold-cell">
                        {threshold} {unit}
                      </td>
                      <td>
                        <span className={`status-pill status-pill--${status}`}>
                          {status === 'ok'
                            ? '✓ In Stock'
                            : status === 'low'
                            ? '↓ Low Stock'
                            : '⚠ Critical'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="row-menu-btn"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="table-empty">
                <span>🔍</span>
                <p>No ingredients found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3>Add New Ingredient</h3>
              <button
                className="modal__close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal__body">
              <div className="modal-form-group">
                <label>Ingredient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken Breast"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option>MEAT</option>
                    <option>SEAFOOD</option>
                    <option>VEGETABLE</option>
                    <option>SPICE</option>
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) =>
                      setForm({ ...form, unit: e.target.value })
                    }
                  >
                    <option>kg</option>
                    <option>g</option>
                    <option>L</option>
                    <option>pcs</option>
                  </select>
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Current Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                  />
                </div>
                <div className="modal-form-group">
                  <label>Threshold</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.minThreshold}
                    onChange={(e) =>
                      setForm({ ...form, minThreshold: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal__footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleAddIngredient}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Ingredient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;