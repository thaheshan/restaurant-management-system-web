'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/DashboardLayout/MainDashboard'
import { FiRefreshCw, FiTrash2, FiChevronDown, FiShoppingBag, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { FaUtensils } from 'react-icons/fa'

const STATUS_LABELS: Record<string, string> = {
  order_placed: 'Order Placed', start_prep: 'Start Prep', in_progress: 'In Progress', served: 'Served',
}
const STATUS_COLORS: Record<string, string> = {
  order_placed: '#3b82f6', start_prep: '#f97316', in_progress: '#eab308', served: '#22c55e',
}
const STATUS_BG: Record<string, string> = {
  order_placed: 'rgba(59,130,246,0.1)', start_prep: 'rgba(249,115,22,0.1)', in_progress: 'rgba(234,179,8,0.1)', served: 'rgba(34,197,94,0.1)',
}
const NEXT_STATUS: Record<string, string> = {
  order_placed: 'start_prep', start_prep: 'in_progress', in_progress: 'served',
}
const NEXT_LABELS: Record<string, string> = {
  order_placed: 'Start Prep', start_prep: 'In Progress', in_progress: 'Mark Served',
}
const STATUS_ICONS: Record<string, any> = {
  order_placed: FiShoppingBag, start_prep: FiAlertCircle, in_progress: FiClock, served: FiCheckCircle,
}

const P = '#2d5a3d'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [restaurantId, setRestaurantId] = useState('')
  const [token, setToken] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    try {
      const session = localStorage.getItem('adminSession')
      if (session) {
        const parsed = JSON.parse(session)
        setRestaurantId(parsed.user?.restaurantId || parsed.restaurantId || '')
        setToken(parsed.token || '')
      }
    } catch {}
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!restaurantId || !token) return
    try {
      const res = await fetch(`http://localhost:8000/api/orders/restaurant/${restaurantId}/orders`,
        { headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'admin', 'x-restaurant-id': restaurantId } })
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || []);
        setError('');
      }
      else setError(data.error || 'Failed to fetch orders')
    } catch { setError('Failed to fetch orders') }
    finally { setLoading(false) }
  }, [restaurantId, token])

  useEffect(() => {
    if (restaurantId && token) {
      fetchOrders()
      const interval = setInterval(fetchOrders, 10000)
      return () => clearInterval(interval)
    }
  }, [restaurantId, token, fetchOrders])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) fetchOrders()
      else setError(data.error || 'Failed to update status')
    } catch { setError('Network error') }
    finally { setUpdating(null) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${deleteTarget.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Order deleted successfully!')
        setDeleteTarget(null)
        fetchOrders()
        setTimeout(() => setSuccess(''), 3000)
      } else setError(data.error || 'Failed to delete order')
    } catch { setError('Network error') }
    finally { setDeleting(false) }
  }

  const safeFloat = (v: any) => { const n = parseFloat(v); return isNaN(n) ? 0 : n }

  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.order_status === statusFilter)
  const totalRevenue = orders.filter(o => o.order_status === 'served').reduce((s, o) => s + safeFloat(o.grand_total), 0)
  const counts = {
    all: orders.length,
    order_placed: orders.filter(o => o.order_status === 'order_placed').length,
    in_progress: orders.filter(o => o.order_status === 'in_progress' || o.order_status === 'start_prep').length,
    served: orders.filter(o => o.order_status === 'served').length,
  }

  return (
    <DashboardLayout title="Orders Management">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Orders Management</h1>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>Real-time order tracking and status updates</p>
          </div>
          <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${P}`, borderRadius: 8, background: 'white', color: P, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Orders', value: counts.all, color: P, bg: 'rgba(45,90,61,0.08)', Icon: FiShoppingBag },
            { label: 'Order Placed', value: counts.order_placed, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', Icon: FiAlertCircle },
            { label: 'In Progress', value: counts.in_progress, color: '#f97316', bg: 'rgba(249,115,22,0.08)', Icon: FiClock },
            { label: 'Served Today', value: counts.served, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', Icon: FiCheckCircle },
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

        {/* Revenue Banner */}
        <div style={{ background: `linear-gradient(135deg, ${P}, #1a3d28)`  , borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaUtensils size={22} color="rgba(255,255,255,0.7)" />
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue (Served Orders)</p>
              <p style={{ color: 'white', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Rs. {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', margin: 0 }}>Last updated</p>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', margin: 0 }}>{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {success && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', padding: '10px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiCheckCircle size={16} /> {success}
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626', padding: '10px 16px', borderRadius: 8, fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'all', label: 'All Orders', count: counts.all },
            { key: 'order_placed', label: 'Order Placed', count: counts.order_placed },
            { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
            { key: 'served', label: 'Served', count: counts.served },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
              padding: '7px 16px', borderRadius: 20, border: statusFilter === f.key ? `1.5px solid ${P}` : '1px solid #e5e7eb',
              background: statusFilter === f.key ? P : 'white', color: statusFilter === f.key ? 'white' : '#555',
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {f.label}
              <span style={{ background: statusFilter === f.key ? 'rgba(255,255,255,0.25)' : '#f3f4f6', borderRadius: 10, padding: '1px 7px', fontSize: '0.72rem' }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed #e5e7eb', borderRadius: 16 }}>
            <FaUtensils size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
            <p style={{ fontWeight: 700, color: '#374151', margin: '0 0 4px' }}>No orders yet</p>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>Orders placed by customers will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(order => {
              const StatusIcon = STATUS_ICONS[order.order_status] || FiShoppingBag
              const isExpanded = expandedOrder === order.id
              return (
                <div key={order.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? '#fafafa' : 'white' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: STATUS_BG[order.order_status] || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: STATUS_COLORS[order.order_status] || '#888', flexShrink: 0 }}>
                        <StatusIcon size={18} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#1a1a1a', margin: 0, fontSize: '0.9rem' }}>#{order.id.slice(0, 8)}</p>
                        <p style={{ color: '#888', fontSize: '0.75rem', margin: 0 }}>Table {order.table_number}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 28 }}>
                        {[
                          { label: 'Items', value: `${order.items?.length || 0} items` },
                          { label: 'Total', value: `Rs. ${safeFloat(order.grand_total).toLocaleString()}` },
                          { label: 'Time', value: new Date(order.created_at).toLocaleTimeString() },
                        ].map(info => (
                          <div key={info.label}>
                            <p style={{ fontSize: '0.68rem', color: '#aaa', margin: 0, textTransform: 'uppercase' }}>{info.label}</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{info.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: STATUS_BG[order.order_status] || '#f3f4f6', color: STATUS_COLORS[order.order_status] || '#888', fontWeight: 700, fontSize: '0.75rem' }}>
                        <StatusIcon size={12} />
                        {STATUS_LABELS[order.order_status] || order.order_status}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteTarget(order); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                      <FiChevronDown size={18} color="#9ca3af" style={{ transition: '0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <p style={{ fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px', fontSize: '0.9rem' }}>Order Items</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(Array.isArray(order.items) ? order.items : []).map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fafafa', borderRadius: 8 }}>
                              <div>
                                <p style={{ fontWeight: 600, color: '#1a1a1a', margin: 0, fontSize: '0.85rem' }}>{item.name}</p>
                                <p style={{ color: '#888', fontSize: '0.75rem', margin: 0 }}>Qty: {item.quantity}</p>
                              </div>
                              <p style={{ fontWeight: 600, color: P, margin: 0 }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p style={{ fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px', fontSize: '0.9rem' }}>Order Timeline</p>
                        <div style={{ display: 'flex', gap: 0 }}>
                          {['order_placed', 'start_prep', 'in_progress', 'served'].map((status, idx, arr) => {
                            const statuses = ['order_placed', 'start_prep', 'in_progress', 'served']
                            const isActive = statuses.indexOf(order.order_status) >= idx
                            const SIcon = STATUS_ICONS[status] || FiShoppingBag
                            return (
                              <div key={status} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: isActive ? P : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? 'white' : '#9ca3af' }}>
                                    <SIcon size={14} />
                                  </div>
                                  <span style={{ fontSize: '0.68rem', color: isActive ? P : '#9ca3af', fontWeight: isActive ? 700 : 400, whiteSpace: 'nowrap' }}>{STATUS_LABELS[status]}</span>
                                </div>
                                {idx < arr.length - 1 && (
                                  <div style={{ flex: 1, height: 2, background: statuses.indexOf(order.order_status) > idx ? P : '#e5e7eb', margin: '0 4px', marginBottom: 20 }} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        {NEXT_STATUS[order.order_status] && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, NEXT_STATUS[order.order_status])}
                            disabled={updating === order.id}
                            style={{ flex: 1, padding: '12px', background: P, color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: updating === order.id ? 0.6 : 1 }}
                          >
                            <FiCheckCircle size={16} />
                            {updating === order.id ? 'Updating...' : `Mark as ${NEXT_LABELS[order.order_status]}`}
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(order)}
                          style={{ padding: '12px 20px', background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <FiTrash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 420, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiTrash2 size={22} color="#dc2626" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Delete Order</h3>
                <p style={{ margin: 0, color: '#888', fontSize: '0.82rem' }}>This action cannot be undone</p>
              </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              {[
                ['Order ID', `#${deleteTarget.id.slice(0, 8)}`],
                ['Table', deleteTarget.table_number],
                ['Total', `Rs. ${safeFloat(deleteTarget.grand_total).toLocaleString()}`],
                ['Status', STATUS_LABELS[deleteTarget.order_status] || deleteTarget.order_status],
              ].map(([k, v]) => (
                <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.85rem', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ color: '#888' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '12px', background: '#dc2626', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', color: 'white', opacity: deleting ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <FiTrash2 size={15} /> {deleting ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}