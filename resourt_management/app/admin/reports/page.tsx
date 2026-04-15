'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/DashboardLayout/MainDashboard'
import { FiRefreshCw, FiDownload, FiShoppingBag, FiCheckCircle, FiAlertTriangle, FiAlertOctagon, FiPackage, FiClock, FiFileText } from 'react-icons/fi'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const API = 'http://localhost:8000'
const P = '#2d5a3d'

const getSession = () => {
  try {
    const s = localStorage.getItem('adminSession')
    if (s) { const p = JSON.parse(s); return { token: p.token, restaurantId: p.user?.restaurantId || p.restaurantId, restaurantName: p.user?.name || 'Restaurant' } }
  } catch {}
  return { token: '', restaurantId: '', restaurantName: '' }
}

const safeFloat = (val: any) => { const n = parseFloat(val); return isNaN(n) ? 0 : n }

export default function ReportPage() {
  const [session, setSession] = useState({ token: '', restaurantId: '', restaurantName: '' })
  const [orders, setOrders] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [expiry, setExpiry] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<'all' | 'orders' | 'inventory' | 'expiry'>('all')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [filterMonth, setFilterMonth] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [generatedAt, setGeneratedAt] = useState('')

  useEffect(() => {
    const s = getSession(); setSession(s)
    const now = new Date()
    setGeneratedAt(now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }))
    const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000))
    setDateFrom(ninetyDaysAgo.toISOString().split('T')[0])
    setDateTo(now.toISOString().split('T')[0])
  }, [])

  const fetchAll = useCallback(async () => {
    if (!session.token || !session.restaurantId) return
    setLoading(true)
    const headers = { Authorization: `Bearer ${session.token}`, 'x-user-role': 'admin', 'x-restaurant-id': session.restaurantId }
    try {
      const [oRes, iRes, eRes] = await Promise.all([
        fetch(`${API}/api/orders/restaurant/${session.restaurantId}/orders?all=true`, { headers }),
        fetch(`${API}/api/inventory/restaurant/${session.restaurantId}`, { headers }),
        fetch(`${API}/api/inventory/restaurant/${session.restaurantId}/expiry-alerts`, { headers }),
      ])
      const [oData, iData, eData] = await Promise.all([oRes.json(), iRes.json(), eRes.json()])
      if (oData.success) setOrders(oData.orders || [])
      if (iData.success) setInventory(iData.inventory || iData.ingredients || [])
      if (eData.success) setExpiry(eData.expiringItems || [])
    } catch {}
    setLoading(false)
  }, [session])

  useEffect(() => { fetchAll() }, [fetchAll])

  const filteredOrders = orders.filter(o => {
    const matchStatus = orderStatusFilter === 'all' || o.order_status === orderStatusFilter
    const date = new Date(o.created_at)
    const orderDate = date.toISOString().split('T')[0]
    
    // Month filter logic
    if (filterMonth !== 'all') {
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthYear !== filterMonth) return false
    }

    return matchStatus && (!dateFrom || orderDate >= dateFrom) && (!dateTo || orderDate <= dateTo)
  }).sort((a, b) => {
    return sortOrder === 'desc' 
      ? safeFloat(b.grand_total) - safeFloat(a.grand_total) 
      : safeFloat(a.grand_total) - safeFloat(b.grand_total)
  })

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + safeFloat(o.grand_total), 0)
  const servedOrders = filteredOrders.filter(o => o.order_status === 'served').length
  const criticalStock = inventory.filter(i => parseFloat(i.quantity ?? 0) <= 0).length
  const lowStock = inventory.filter(i => { const qty = parseFloat(i.quantity ?? 0); return qty > 0 && qty < 2; }).length
  const expiredItems = expiry.filter(e => Math.floor((new Date(e.expiry_date).getTime() - Date.now()) / 86400000) < 0).length

  const show = (s: string) => activeSection === 'all' || activeSection === s

  const handleDownloadPDF = () => {
    const doc = new jsPDF(); const pageW = doc.internal.pageSize.getWidth(); let y = 20
    doc.setFillColor(45, 90, 61); doc.rect(0, 0, pageW, 35, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont('helvetica', 'bold'); doc.text('DineSmart', 14, 15)
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.text('Restaurant Management Report', 14, 24)
    doc.setFontSize(9); doc.text('Generated: ' + generatedAt, 14, 31); y = 45
    doc.setTextColor(0, 0, 0); doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text('SUMMARY', 14, y); y += 6
    const boxes = [
      { label: 'Total Revenue', value: 'Rs. ' + totalRevenue.toLocaleString(), color: [39, 174, 96] as [number,number,number] },
      { label: 'Low Stock', value: lowStock + ' items', color: [243, 156, 18] as [number,number,number] },
      { label: 'Critical Stock', value: criticalStock + ' items', color: [230, 126, 34] as [number,number,number] },
      { label: 'Expired Items', value: expiredItems + ' items', color: [231, 76, 60] as [number,number,number] },
    ]
    const bw = (pageW - 28) / 4
    boxes.forEach((box, i) => {
      const x = 14 + i * (bw + 2)
      doc.setFillColor(box.color[0], box.color[1], box.color[2]); doc.roundedRect(x, y, bw, 18, 2, 2, 'F')
      doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.text(box.label.toUpperCase(), x+3, y+6)
      doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.text(box.value, x+3, y+14)
    }); y += 26; doc.setTextColor(0,0,0)
    if (show('orders') && filteredOrders.length > 0) {
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.text('Orders Report ('+filteredOrders.length+' orders)', 14, y); y += 6

      // Group for PDF
      const pdfGroups = filteredOrders.reduce((acc, order) => {
        const date = new Date(order.created_at);
        const m = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[m]) acc[m] = [];
        acc[m].push(order);
        return acc;
      }, {} as Record<string, any[]>);

      Object.entries(pdfGroups).forEach(([month, monthOrders]) => {
        if (y > 230) { doc.addPage(); y = 20 }
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(45, 90, 61);
        doc.text(month.toUpperCase(), 14, y); y += 4;
        
        autoTable(doc, { 
          startY: y, 
          head: [['Order ID','Table','Items','Total','Status','Time']], 
          body: (monthOrders as any[]).map((o: any) => ['#'+o.id.slice(0,8),'Table '+o.table_number,(o.items?.length||0)+' items','Rs. '+safeFloat(o.grand_total).toLocaleString(),(o.order_status||'').replace(/_/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase()),new Date(o.created_at).toLocaleTimeString()]),
          headStyles: { fillColor: [45,90,61], textColor: 255, fontSize: 8 },
          bodyStyles: { fontSize: 7 },
          margin: { left: 14, right: 14 }
        });
        const monthTotal = (monthOrders as any[]).reduce((s: number, o: any) => s + safeFloat(o.grand_total), 0);
        y = (doc as any).lastAutoTable.finalY + 6;
        doc.setFontSize(8); doc.text(`Month Subtotal: Rs. ${monthTotal.toLocaleString()}`, pageW - 60, y);
        y += 10;
      });
      y += 5;
    }
    if (show('inventory') && inventory.length > 0) {
      if (y > 200) { doc.addPage(); y = 20 }
      doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(0,0,0); doc.text('Inventory Report ('+inventory.length+' items)', 14, y); y += 4
      autoTable(doc, { 
        startY: y, 
        head: [['Ingredient','Category','Quantity','Min Limit','Expiry','Status']], 
        body: inventory.map((i:any) => { 
          const qty = safeFloat(i.quantity);
          let status = 'In Stock';
          if (qty <= 0) status = 'Critical';
          else if (qty < 2) status = 'Low Stock';
          return [i.name, i.category || 'Other', qty.toFixed(2) + ' ' + (i.unit || ''), '2.00 ' + (i.unit || ''), i.expiry_date ? new Date(i.expiry_date).toLocaleDateString() : 'N/A', status];
        }), 
        headStyles: { fillColor: [45,90,61], textColor: 255, fontStyle: 'bold', fontSize: 9 }, 
        bodyStyles: { fontSize: 8 }, 
        alternateRowStyles: { fillColor: [248,250,252] }, 
        margin: { left: 14, right: 14 } 
      })
      y = (doc as any).lastAutoTable.finalY + 12
    }
    if (show('expiry') && expiry.length > 0) {
      if (y > 200) { doc.addPage(); y = 20 }
      doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(0,0,0); doc.text('Expiry Alerts ('+expiry.length+' items)', 14, y); y += 4
      autoTable(doc, { startY: y, head: [['Ingredient','Category','Quantity','Expiry Date','Days Left','Status']], body: expiry.map((e:any) => { const days=Math.floor((new Date(e.expiry_date).getTime()-Date.now())/86400000); const isExpired=days<0; return [e.name,e.category||'Other',safeFloat(e.quantity).toFixed(2)+' '+(e.unit||''),new Date(e.expiry_date).toLocaleDateString(),isExpired?Math.abs(days)+'d overdue':days===0?'Today':days+'d left',isExpired?'Expired':'Critical'] }), headStyles: { fillColor: [231,76,60], textColor: 255, fontStyle: 'bold', fontSize: 9 }, bodyStyles: { fontSize: 8 }, alternateRowStyles: { fillColor: [255,248,248] }, margin: { left: 14, right: 14 } })
    }
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150,150,150); doc.text('DineSmart Report - Confidential | Page '+i+' of '+pageCount, 14, doc.internal.pageSize.getHeight()-8) }
    doc.save('DineSmart-Report-'+new Date().toISOString().split('T')[0]+'.pdf')
  }

  const handleDownloadCSV = () => {
    const rows = filteredOrders.map(o => {
      const date = new Date(o.created_at);
      return [
        o.id,
        date.toLocaleString('default', { month: 'long', year: 'numeric' }),
        date.toISOString(),
        o.table_number,
        o.payment_method || 'pending',
        o.order_status,
        safeFloat(o.grand_total)
      ];
    });

    let csvContent = ['Order ID', 'Month', 'Exact Date', 'Table', 'Payment Method', 'Status', 'Total'].join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.body.appendChild(document.createElement('a'));
    link.href = URL.createObjectURL(blob);
    link.download = `DineSmart_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    document.body.removeChild(link);
  };

  const months = Array.from(new Set(orders.map(o => {
    const date = new Date(o.created_at);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }))).sort().reverse();

  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.3px', display: 'block', marginBottom: 4 }
  const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left' as const, fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.4px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }
  const tdStyle: React.CSSProperties = { padding: '11px 16px', fontSize: '0.85rem', borderBottom: '1px solid #f5f5f5' }

  return (
    <DashboardLayout title="Reports">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Reports</h1>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>View and export detailed reports</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${P}`, borderRadius: 8, background: 'white', color: P, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', border: 'none', borderRadius: 8, background: P, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
              <FiDownload size={14} /> PDF
            </button>
            <button onClick={handleDownloadCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', border: 'none', borderRadius: 8, background: '#1a1a1a', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
              <FiFileText size={14} /> CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', padding: '20px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 14px' }}>Filters</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div><label style={labelStyle}>Report Section</label>
              <select value={activeSection} onChange={e => setActiveSection(e.target.value as any)} style={inputStyle}>
                <option value="all">All Sections</option><option value="orders">Orders Only</option><option value="inventory">Inventory Only</option><option value="expiry">Expiry Only</option>
              </select>
            </div>
            <div><label style={labelStyle}>Month</label>
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={inputStyle}>
                <option value="all">All Months</option>
                {months.map(m => (
                  <option key={m} value={m}>{new Date(m + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</option>
                ))}
              </select>
            </div>
            <div><label style={labelStyle}>Sort By Value</label>
              <button 
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                style={{ ...inputStyle, background: 'white', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
                <FiRefreshCw size={12} style={{ opacity: 0.5 }} />
              </button>
            </div>
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading report data...</div>}

        {!loading && (
          <div>
            {/* Report Header */}
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: P, margin: 0 }}>DineSmart</h2>
                  <p style={{ color: '#444', fontWeight: 600, margin: '4px 0 2px' }}>Restaurant Management Report</p>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Generated: {generatedAt}</p>
                  {dateFrom && dateTo && <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Period: {dateFrom} to {dateTo}</p>}
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
                  <FiFileText size={24} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, sub: `${filteredOrders.length} orders`, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', Icon: FiShoppingBag },
                  { label: 'Low Stock', value: String(lowStock), sub: 'below 2kg items', color: '#f39c12', bg: 'rgba(243,156,18,0.08)', Icon: FiAlertTriangle },
                  { label: 'Critical Stock', value: String(criticalStock), sub: 'out of stock items', color: '#e74c3c', bg: 'rgba(231,76,60,0.08)', Icon: FiAlertOctagon },
                  { label: 'Expired Items', value: String(expiredItems), sub: 'require disposal', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', Icon: FiAlertOctagon },
                ].map(c => (
                  <div key={c.label} style={{ background: c.bg, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <c.Icon size={15} color={c.color} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: c.color, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{c.label}</span>
                    </div>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: c.color, margin: 0 }}>{c.value}</p>
                    <p style={{ fontSize: '0.73rem', color: c.color, margin: 0, opacity: 0.7 }}>{c.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {show('orders') && (
              <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><FiShoppingBag size={16} /></div>
                    <div><p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Orders Report</p><p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>{filteredOrders.length} orders found</p></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>Total Revenue</p>
                    <p style={{ margin: 0, fontWeight: 800, color: P, fontSize: '1.1rem' }}>Rs. {totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
                {(() => {
                  const groups = filteredOrders.reduce((acc, order) => {
                    const date = new Date(order.created_at);
                    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    if (!acc[month]) acc[month] = [];
                    acc[month].push(order);
                    return acc;
                  }, {} as Record<string, any[]>);

                  return Object.entries(groups).map(([month, monthOrders]) => (
                    <div key={month}>
                      <div style={{ background: '#f8fafc', padding: '8px 20px', fontSize: '0.75rem', fontWeight: 800, color: P, borderBottom: '1px solid #f0f0f0', textTransform: 'uppercase' }}>
                        {month}
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          {(monthOrders as any[]).map((order: any) => (
                            <tr key={order.id} style={{ background: 'white' }}>
                              <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#666' }}>#{order.id.slice(0,8)}</span></td>
                              <td style={{ ...tdStyle, fontWeight: 600, width: '15%' }}>Table {order.table_number}</td>
                              <td style={{ ...tdStyle, color: '#666', width: '15%' }}>{order.items?.length || 0} items</td>
                              <td style={{ ...tdStyle, fontWeight: 700, color: P, width: '20%' }}>Rs. {safeFloat(order.grand_total).toLocaleString()}</td>
                              <td style={{ ...tdStyle, width: '20%' }}>
                                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: order.order_status==='served'?'rgba(34,197,94,0.1)':order.order_status==='in_progress'?'rgba(234,179,8,0.1)':order.order_status==='start_prep'?'rgba(249,115,22,0.1)':'rgba(59,130,246,0.1)', color: order.order_status==='served'?'#16a34a':order.order_status==='in_progress'?'#ca8a04':order.order_status==='start_prep'?'#ea580c':'#2563eb' }}>
                                  {(order.order_status||'').replace(/_/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase())}
                                </span>
                              </td>
                              <td style={{ ...tdStyle, color: '#888', fontSize: '0.78rem', textAlign: 'right' }}>{new Date(order.created_at).toLocaleTimeString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ));
                })()}
                {filteredOrders.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>No orders found</div>}
              </div>
            )}

            {/* Inventory Table */}
            {show('inventory') && (
              <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}><FiPackage size={16} /></div>
                  <div><p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Inventory Report</p><p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>{inventory.length} items · {criticalStock} critical</p></div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Ingredient','Category','Quantity','Reorder Level','Expiry','Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>
                    {inventory.length === 0 ? <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af', padding: 32 }}>No inventory items</td></tr>
                    : inventory.map((item: any) => {
                      const qty = safeFloat(item.quantity);
                      let sl = 'ok';
                      if (qty <= 0) sl = 'critical';
                      else if (qty < 2) sl = 'low';
                      
                      return (
                        <tr key={item.id} style={{ background: sl === 'critical' ? 'rgba(231,76,60,0.03)' : sl === 'low' ? 'rgba(243,156,18,0.02)' : 'white' }}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: '#1a1a1a' }}>{item.name}</td>
                          <td style={{ ...tdStyle, color: '#888' }}>{item.category || 'Other'}</td>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{qty.toFixed(2)} {item.unit}</td>
                          <td style={{ ...tdStyle, color: '#888' }}>2.00 {item.unit}</td>
                          <td style={{ ...tdStyle, color: '#888', fontSize: '0.8rem' }}>{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</td>
                          <td style={tdStyle}>
                            <span style={{ 
                              padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, 
                              background: sl === 'critical' ? 'rgba(231,76,60,0.1)' : sl === 'low' ? 'rgba(243,156,18,0.1)' : 'rgba(34,197,94,0.1)', 
                              color: sl === 'critical' ? '#e74c3c' : sl === 'low' ? '#f39c12' : '#16a34a' 
                            }}>
                              {sl === 'critical' ? 'Critical' : sl === 'low' ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Expiry Table */}
            {show('expiry') && (
              <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(231,76,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c' }}><FiClock size={16} /></div>
                  <div><p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>Expiry Alerts Report</p><p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>{expiry.length} items · {expiredItems} expired</p></div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Ingredient','Category','Quantity','Expiry Date','Days Left','Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>
                    {expiry.length === 0 ? <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af', padding: 32 }}>No expiry alerts</td></tr>
                    : expiry.map((item: any) => {
                      const days = Math.floor((new Date(item.expiry_date).getTime()-Date.now())/86400000)
                      const isExpired = days < 0
                      return (
                        <tr key={item.id} style={{ background: isExpired?'rgba(231,76,60,0.03)':'rgba(230,126,34,0.03)' }}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: '#1a1a1a' }}>{item.name}</td>
                          <td style={{ ...tdStyle, color: '#888' }}>{item.category || 'Other'}</td>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{safeFloat(item.quantity).toFixed(2)} {item.unit}</td>
                          <td style={{ ...tdStyle, color: '#888' }}>{new Date(item.expiry_date).toLocaleDateString()}</td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: isExpired?'#e74c3c':'#e67e22' }}>{isExpired?`${Math.abs(days)}d overdue`:days===0?'Today':`${days}d left`}</td>
                          <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: isExpired?'rgba(231,76,60,0.1)':'rgba(230,126,34,0.1)', color: isExpired?'#e74c3c':'#e67e22' }}>{isExpired?'Expired':'Critical'}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb', padding: '14px 20px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#888' }}>Report generated by <strong style={{ color: P }}>DineSmart</strong> · {generatedAt}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#aaa' }}>This report is confidential and intended for authorized personnel only.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}