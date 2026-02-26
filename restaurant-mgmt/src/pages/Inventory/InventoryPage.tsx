import React, { useState } from "react";
import { Plus, Edit2, Trash2, AlertTriangle, Search, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addInventoryItem, updateInventoryItem, deleteInventoryItem, updateStock } from "../../store/slices/inventorySlice";
import { InventoryItem, HealthStatus, UnitType } from "../../types";
import Modal from "../../components/ui/Modal";
import HealthBadge from "../../components/ui/HealthBadge";
import PageHeader from "../../components/shared/PageHeader";
import { formatCurrency, getDaysUntilExpiry, calculateStockPercentage } from "../../utils/helpers";

const HS: HealthStatus[]  = ["fresh","good","warning","critical","expired"];
const UNITS: UnitType[]   = ["kg","g","liter","ml","piece","box","bag"];
const EF = { name:"", category:"", quantity:0, unit:"kg" as UnitType, minimumStock:0, maximumStock:100, currentStock:0, healthStatus:"good" as HealthStatus, expiryDate:"", receivedDate:new Date().toISOString().split("T")[0], supplier:"", pricePerUnit:0, location:"", notes:"" };

const InventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, alerts } = useAppSelector((s) => s.inventory);
  const [open,   setOpen]   = useState(false);
  const [editing,setEditing]= useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const [fs,     setFs]     = useState<HealthStatus|"all">("all");
  const [form,   setForm]   = useState(EF);
  const [upId,   setUpId]   = useState<string|null>(null);
  const [ns,     setNs]     = useState(0);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) && (fs === "all" || i.healthStatus === fs)
  );
  const openAdd  = () => { setForm(EF); setEditing(false); setEditId(null); setOpen(true); };
  const openEdit = (item: InventoryItem) => {
    setForm({ name:item.name,category:item.category,quantity:item.quantity,unit:item.unit,minimumStock:item.minimumStock,maximumStock:item.maximumStock,currentStock:item.currentStock,healthStatus:item.healthStatus,expiryDate:item.expiryDate,receivedDate:item.receivedDate,supplier:item.supplier,pricePerUnit:item.pricePerUnit,location:item.location,notes:item.notes||"" });
    setEditing(true); setEditId(item.id); setOpen(true);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editId) dispatch(updateInventoryItem({ ...form, id: editId, lastUpdated: new Date().toISOString() }));
    else dispatch(addInventoryItem(form));
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader title="Inventory & Health" subtitle="Track stock levels and ingredient freshness" actions={<button className="btn btn-primary" onClick={openAdd}><Plus size={16}/>Add Item</button>} />

      {alerts.length > 0 && (
        <div style={{ padding: "14px 20px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={18} color="var(--warning)" />
          <span style={{ fontSize: 14, color: "var(--warning)" }}><strong>{alerts.length} items</strong> require immediate attention — check stock levels and expiry dates</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", maxWidth: 280, flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="form-input" style={{ paddingLeft: 36, height: 38 }} placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 160, height: 38 }} value={fs} onChange={e => setFs(e.target.value as HealthStatus|"all")}>
          <option value="all">All Status</option>
          {HS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
        {[{ l:"Total Items",v:items.length,c:"var(--info)"},{l:"Fresh",v:items.filter(i=>i.healthStatus==="fresh").length,c:"var(--success)"},{l:"Low Stock",v:items.filter(i=>i.healthStatus==="warning").length,c:"var(--warning)"},{l:"Critical",v:items.filter(i=>i.healthStatus==="critical").length,c:"var(--danger)"}].map(s => (
          <div key={s.l} style={{ padding: 16, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontFamily: "Cormorant Garamond", fontSize: 28, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead><tr><th>Item</th><th>Category</th><th>Stock Level</th><th>Health</th><th>Expiry</th><th>Supplier</th><th>Value</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(item => {
              const days = getDaysUntilExpiry(item.expiryDate);
              const pct  = calculateStockPercentage(item.currentStock, item.maximumStock);
              return (
                <tr key={item.id}>
                  <td><div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: 14 }}>{item.name}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.location}</div></td>
                  <td><span className="badge" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{item.category}</span></td>
                  <td>
                    {upId === item.id ? (
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input type="number" className="form-input" style={{ width: 70, height: 30, padding: "4px 8px", fontSize: 13 }} value={ns} onChange={e => setNs(parseFloat(e.target.value))} min="0" />
                        <button className="btn btn-primary btn-sm" onClick={() => { dispatch(updateStock({ id: item.id, quantity: ns })); setUpId(null); }} style={{ padding: "4px 10px" }}>✓</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setUpId(null)}>✕</button>
                      </div>
                    ) : (
                      <div style={{ minWidth: 120 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--text-primary)" }}>{item.currentStock} {item.unit}</span><span style={{ color: "var(--text-muted)" }}>{pct}%</span></div>
                        <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}><div style={{ height: "100%", width: `${pct}%`, background: pct < 20 ? "var(--danger)" : pct < 50 ? "var(--warning)" : "var(--success)", borderRadius: 2 }} /></div>
                      </div>
                    )}
                  </td>
                  <td><HealthBadge status={item.healthStatus} /></td>
                  <td><div style={{ fontSize: 13, color: days < 3 ? "var(--danger)" : days < 7 ? "var(--warning)" : "var(--text-secondary)" }}>{days < 0 ? "Expired" : days === 0 ? "Today" : `${days}d left`}</div></td>
                  <td style={{ fontSize: 13 }}>{item.supplier}</td>
                  <td style={{ color: "var(--accent)", fontWeight: 500 }}>{formatCurrency(item.currentStock * item.pricePerUnit)}</td>
                  <td><div style={{ display: "flex", gap: 4 }}><button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setUpId(item.id); setNs(item.currentStock); }}><RefreshCw size={13}/></button><button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)}><Edit2 size={13}/></button><button className="btn btn-danger btn-icon btn-sm" onClick={() => { if (window.confirm("Remove item?")) dispatch(deleteInventoryItem(item.id)); }}><Trash2 size={13}/></button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>No inventory items found</div>}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? "Edit Inventory Item" : "Add Inventory Item"} maxWidth={620}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="grid-2"><div className="form-group"><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Roma Tomatoes"/></div><div className="form-group"><label className="form-label">Category *</label><input className="form-input" required value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Vegetables"/></div></div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Current Stock</label><input type="number" className="form-input" min="0" step="0.1" value={form.currentStock} onChange={e=>setForm({...form,currentStock:parseFloat(e.target.value)})}/></div><div className="form-group"><label className="form-label">Unit</label><select className="form-select" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value as UnitType})}>{UNITS.map(u=><option key={u} value={u}>{u}</option>)}</select></div></div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Min Stock</label><input type="number" className="form-input" min="0" value={form.minimumStock} onChange={e=>setForm({...form,minimumStock:parseFloat(e.target.value)})}/></div><div className="form-group"><label className="form-label">Max Stock</label><input type="number" className="form-input" min="0" value={form.maximumStock} onChange={e=>setForm({...form,maximumStock:parseFloat(e.target.value)})}/></div></div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Received Date</label><input type="date" className="form-input" value={form.receivedDate} onChange={e=>setForm({...form,receivedDate:e.target.value})}/></div><div className="form-group"><label className="form-label">Expiry Date *</label><input type="date" className="form-input" required value={form.expiryDate} onChange={e=>setForm({...form,expiryDate:e.target.value})}/></div></div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Supplier</label><input className="form-input" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="Farm Fresh Co."/></div><div className="form-group"><label className="form-label">Price per Unit ($)</label><input type="number" className="form-input" min="0" step="0.01" value={form.pricePerUnit} onChange={e=>setForm({...form,pricePerUnit:parseFloat(e.target.value)})}/></div></div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Cold Room A"/></div><div className="form-group"><label className="form-label">Health Status</label><select className="form-select" value={form.healthStatus} onChange={e=>setForm({...form,healthStatus:e.target.value as HealthStatus})}>{HS.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div></div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Additional notes..."/></div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? "Save Changes" : "Add Item"}</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
