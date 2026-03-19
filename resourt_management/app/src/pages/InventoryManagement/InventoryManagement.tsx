import React, { useState } from 'react';
import './InventoryManagement.scss';

interface Ingredient {
  id: number;
  name: string;
  category: string;
  stock: string;
  unit: string;
  threshold: string;
  status: 'critical' | 'low' | 'ok';
}

const ingredients: Ingredient[] = [
  { id: 1, name: 'Chicken',   category: 'MEAT',      stock: '30',  unit: 'kg', threshold: '15 kg',  status: 'ok' },
  { id: 2, name: 'Prawns',    category: 'SEAFOOD',   stock: '8',   unit: 'kg', threshold: '5 kg',   status: 'low' },
  { id: 3, name: 'Carrots',   category: 'VEGETABLE', stock: '50',  unit: 'kg', threshold: '20 kg',  status: 'ok' },
  { id: 4, name: 'Tomatoes',  category: 'VEGETABLE', stock: '12',  unit: 'kg', threshold: '10 kg',  status: 'low' },
  { id: 5, name: 'Spices',    category: 'SPICE',     stock: '5',   unit: 'kg', threshold: '3 kg',   status: 'ok' },
  { id: 6, name: 'Dates',     category: 'VEGETABLE', stock: '50',  unit: 'kg', threshold: '10 kg',  status: 'ok' },
  { id: 7, name: 'Onions',    category: 'VEGETABLE', stock: '70',  unit: 'kg', threshold: '20 kg',  status: 'ok' },
  { id: 8, name: 'Ginger',    category: 'SPICE',     stock: '3',   unit: 'kg', threshold: '2 kg',   status: 'low' },
  { id: 9, name: 'Garlic',    category: 'SPICE',     stock: '5',   unit: 'kg', threshold: '3 kg',   status: 'ok' },
];

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

const InventoryManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = ingredients.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: ingredients.length,
    inStock: ingredients.filter(i => i.status === 'ok').length,
    lowStock: ingredients.filter(i => i.status === 'low').length,
    critical: ingredients.filter(i => i.status === 'critical').length,
    waste: '1.8%',
  };

  return (
    <div className="inventory">
      {/* Header */}
      <div className="inventory__header">
        <div>
          <h1 className="inventory__title">Inventory Management</h1>
          <p className="inventory__subtitle">Track and manage your kitchen ingredients</p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Ingredient
        </button>
      </div>

      {/* Stats */}
      <div className="inventory__stats">
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: 'rgba(30,110,78,0.1)', color: '#1e6e4e' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Ingredients Tracking</p>
            <p className="stat-card__value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: 'rgba(39,174,96,0.1)', color: '#27ae96' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <p className="stat-card__label">In Stock</p>
            <p className="stat-card__value">{stats.inStock}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: 'rgba(243,156,18,0.1)', color: '#f39c12' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Low Stock</p>
            <p className="stat-card__value">{stats.lowStock}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Critical Stock</p>
            <p className="stat-card__value">{stats.critical}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: 'rgba(41,128,185,0.1)', color: '#2980b9' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div>
            <p className="stat-card__label">Wastage Rate</p>
            <p className="stat-card__value">{stats.waste}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="inventory__table-card">
        {/* Toolbar */}
        <div className="inventory__toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search ingredients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {['all', 'ok', 'low', 'critical'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filterStatus === f ? 'active' : ''}`}
                onClick={() => setFilterStatus(f)}
              >
                {f === 'all' ? 'All' : f === 'ok' ? 'In Stock' : f === 'low' ? 'Low Stock' : 'Critical'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
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
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="ingredient-name">
                      <span className="ingredient-icon">
                        {categoryIcons[item.category] || '📦'}
                      </span>
                      {item.name}
                    </div>
                  </td>
                  <td>
                    <span
                      className="category-badge"
                      style={{
                        background: `${categoryColors[item.category]}18`,
                        color: categoryColors[item.category],
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <div className="stock-info">
                      <span className="stock-value">{item.stock} {item.unit}</span>
                      <div className="stock-bar">
                        <div
                          className="stock-bar__fill"
                          style={{
                            width: `${Math.min((parseInt(item.stock) / 70) * 100, 100)}%`,
                            background: item.status === 'ok' ? '#27ae60' : item.status === 'low' ? '#f39c12' : '#e74c3c',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="threshold-cell">{item.threshold}</td>
                  <td>
                    <span className={`status-pill status-pill--${item.status}`}>
                      {item.status === 'ok' ? '✓ In Stock' : item.status === 'low' ? '↓ Low Stock' : '⚠ Critical'}
                    </span>
                  </td>
                  <td>
                    <button className="row-menu-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="table-empty">
              <span>🔍</span>
              <p>No ingredients found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Add New Ingredient</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal__body">
              <div className="modal-form-group">
                <label>Ingredient Name</label>
                <input type="text" placeholder="e.g. Chicken Breast" />
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Category</label>
                  <select>
                    <option>MEAT</option>
                    <option>SEAFOOD</option>
                    <option>VEGETABLE</option>
                    <option>SPICE</option>
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Unit</label>
                  <select>
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
                  <input type="number" placeholder="0" />
                </div>
                <div className="modal-form-group">
                  <label>Threshold</label>
                  <input type="number" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowModal(false)}>Add Ingredient</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
