import React, { useState } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addFoodItem, updateFoodItem, deleteFoodItem, toggleFoodAvailability, setSelectedItem } from "../../store/slices/foodSlice";
import { FoodItem, FoodCategory } from "../../types";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/shared/PageHeader";
import { formatCurrency } from "../../utils/helpers";

const CATS: FoodCategory[] = ["appetizer","main_course","dessert","beverage","side_dish","special"];
const CC: Record<FoodCategory,string> = { appetizer:"#4A90D9", main_course:"#E67E22", dessert:"#EC4899", beverage:"#22c55e", side_dish:"#8E44AD", special:"#c9a84c" };
const EF = { name:"", description:"", category:"main_course" as FoodCategory, price:0, cost:0, ingredients:[] as string[], allergens:[] as string[], isAvailable:true, preparationTime:15, calories:0, image:"" };

const FoodPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, selectedItem } = useAppSelector((s) => s.food);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(false);
  const [search,  setSearch]  = useState("");
  const [cat,     setCat]     = useState<FoodCategory|"all">("all");
  const [form,    setForm]    = useState(EF);
  const [ing,     setIng]     = useState("");
  const [al,      setAl]      = useState("");

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) && (cat === "all" || i.category === cat)
  );

  const openAdd  = () => { setForm(EF); setEditing(false); setOpen(true); };
  const openEdit = (item: FoodItem) => { setForm({ ...item }); setEditing(true); setOpen(true); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && selectedItem) dispatch(updateFoodItem({ ...form, id: selectedItem.id, createdAt: selectedItem.createdAt, updatedAt: "" }));
    else dispatch(addFoodItem(form));
    setOpen(false); dispatch(setSelectedItem(null));
  };

  const addIng = () => { if (ing.trim()) { setForm(f => ({ ...f, ingredients: [...f.ingredients, ing.trim()] })); setIng(""); } };
  const addAl  = () => { if (al.trim())  { setForm(f => ({ ...f, allergens:   [...f.allergens,   al.trim()]  })); setAl("");  } };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader title="Food Menu" subtitle="Manage your restaurant menu items" actions={<button className="btn btn-primary" onClick={openAdd}><Plus size={16}/>Add Menu Item</button>} />

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", maxWidth: 280, flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="form-input" style={{ paddingLeft: 36, height: 38 }} placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 160, height: 38 }} value={cat} onChange={e => setCat(e.target.value as FoodCategory|"all")}>
          <option value="all">All Categories</option>
          {CATS.map(c => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATS.map(c => (
          <div key={c} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: cat === c ? `${CC[c]}20` : "var(--bg-card)", border: `1px solid ${cat === c ? CC[c] + "40" : "var(--border)"}`, color: cat === c ? CC[c] : "var(--text-muted)", cursor: "pointer", textTransform: "capitalize" }}
            onClick={() => setCat(cat === c ? "all" : c)}
          >
            {c.replace("_", " ")} ({items.filter(i => i.category === c).length})
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Cost</th><th>Prep</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td><div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: 14 }}>{item.name}</div><div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.description.substring(0, 50)}...</div></td>
                <td><span className="badge" style={{ background: `${CC[item.category]}18`, color: CC[item.category], border: `1px solid ${CC[item.category]}40` }}>{item.category.replace("_", " ")}</span></td>
                <td style={{ color: "var(--accent)", fontWeight: 600 }}>{formatCurrency(item.price)}</td>
                <td>{formatCurrency(item.cost)}</td>
                <td>{item.preparationTime}m</td>
                <td>
                  <button onClick={() => dispatch(toggleFoodAvailability(item.id))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: item.isAvailable ? "var(--success)" : "var(--text-muted)", fontSize: 13 }}>
                    {item.isAvailable ? <ToggleRight size={20}/> : <ToggleLeft size={20}/>}
                    {item.isAvailable ? "Available" : "Off Menu"}
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { dispatch(setSelectedItem(item)); openEdit(item); }}><Edit2 size={14}/></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => { if (window.confirm("Remove item?")) dispatch(deleteFoodItem(item.id)); }}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>No menu items found</div>}
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? "Edit Menu Item" : "Add Menu Item"} maxWidth={640}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Truffle Risotto"/></div>
            <div className="form-group"><label className="form-label">Category *</label><select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as FoodCategory })}>{CATS.map(c => <option key={c} value={c}>{c.replace("_"," ")}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the dish..."/></div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Price ($) *</label><input type="number" className="form-input" min="0" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}/></div>
            <div className="form-group"><label className="form-label">Cost ($)</label><input type="number" className="form-input" min="0" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: parseFloat(e.target.value) })}/></div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Prep Time (min)</label><input type="number" className="form-input" min="1" value={form.preparationTime} onChange={e => setForm({ ...form, preparationTime: parseInt(e.target.value) })}/></div>
            <div className="form-group"><label className="form-label">Calories</label><input type="number" className="form-input" min="0" value={form.calories} onChange={e => setForm({ ...form, calories: parseInt(e.target.value) })}/></div>
          </div>
          <div className="form-group"><label className="form-label">Ingredients</label>
            <div style={{ display: "flex", gap: 8 }}><input className="form-input" value={ing} onChange={e => setIng(e.target.value)} placeholder="Add ingredient" onKeyDown={e => e.key==="Enter"&&(e.preventDefault(),addIng())}/><button type="button" className="btn btn-secondary btn-sm" onClick={addIng}>Add</button></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{form.ingredients.map((x, i) => <span key={i} className="badge" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", cursor: "pointer" }} onClick={() => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_,j) => j!==i) }))}>{x} ×</span>)}</div>
          </div>
          <div className="form-group"><label className="form-label">Allergens</label>
            <div style={{ display: "flex", gap: 8 }}><input className="form-input" value={al} onChange={e => setAl(e.target.value)} placeholder="Add allergen" onKeyDown={e => e.key==="Enter"&&(e.preventDefault(),addAl())}/><button type="button" className="btn btn-secondary btn-sm" onClick={addAl}>Add</button></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{form.allergens.map((x, i) => <span key={i} className="badge" style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.3)", cursor: "pointer" }} onClick={() => setForm(f => ({ ...f, allergens: f.allergens.filter((_,j) => j!==i) }))}>{x} ×</span>)}</div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? "Save Changes" : "Add to Menu"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FoodPage;
