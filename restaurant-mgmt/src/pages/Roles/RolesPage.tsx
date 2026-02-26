import React, { useState } from "react";
import { Shield, Plus, Edit2, Trash2, UserCheck, UserX } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addUser, updateUser, deleteUser, toggleUserStatus } from "../../store/slices/rolesSlice";
import { User, UserRole } from "../../types";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/shared/PageHeader";
import { getRoleColor, getRoleDisplayName, formatDate } from "../../utils/helpers";

const ALL_ROLES: UserRole[] = ["super_admin","manager","chef","waiter","inventory_staff"];
const EUF = { name:"", email:"", role:"waiter" as UserRole, isActive:true };

const RolesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roles, users } = useAppSelector((s) => s.roles);
  const [tab,    setTab]    = useState<"roles"|"staff">("roles");
  const [open,   setOpen]   = useState(false);
  const [editing,setEditing]= useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [uf,     setUf]     = useState(EUF);
  const [selRole,setSelRole]= useState<UserRole|null>(null);

  const shown = selRole ? users.filter(u => u.role === selRole) : users;
  const openAdd  = () => { setUf(EUF); setEditing(false); setEditId(null); setOpen(true); };
  const openEdit = (u: User) => { setUf({ name:u.name, email:u.email, role:u.role, isActive:u.isActive }); setEditing(true); setEditId(u.id); setOpen(true); };
  const submit   = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editId) { const ex = users.find(u => u.id === editId)!; dispatch(updateUser({ ...ex, ...uf })); }
    else dispatch(addUser(uf));
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader title="Roles & Permissions" subtitle="Manage staff roles and system access" />

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, background: "var(--bg-card)", padding: 4, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", width: "fit-content" }}>
        {(["roles","staff"] as const).map(t => (
          <button key={t} className={`btn ${tab===t?"btn-primary":"btn-ghost"}`} style={{ textTransform: "capitalize" }} onClick={() => setTab(t)}>
            {t === "roles" ? <Shield size={15}/> : <UserCheck size={15}/>}
            {t === "roles" ? "Roles & Permissions" : "Staff Management"}
          </button>
        ))}
      </div>

      {/* Roles tab */}
      {tab === "roles" && (
        <div className="grid-3">
          {roles.map(role => (
            <div key={role.id} className="card" style={{ cursor: "pointer" }} onClick={() => { setSelRole(role.name); setTab("staff"); }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${role.color}15`, border: `1px solid ${role.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: role.color }}><Shield size={20}/></div>
                <span className="badge" style={{ background: `${role.color}15`, color: role.color, border: `1px solid ${role.color}30` }}>{role.userCount} users</span>
              </div>
              <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 20, color: "var(--text-primary)", marginBottom: 6 }}>{role.displayName}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>{role.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {role.permissions.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: role.color, flexShrink: 0 }} />
                    <span style={{ color: "var(--text-secondary)" }}>{p.module}:</span>
                    <span className="badge" style={{ background: p.action==="manage"?`${role.color}15`:"var(--bg-hover)", color: p.action==="manage"?role.color:"var(--text-muted)", border: `1px solid ${p.action==="manage"?role.color+"30":"var(--border)"}`, fontSize: 10 }}>{p.action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff tab */}
      {tab === "staff" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className={`btn btn-sm ${!selRole?"btn-primary":"btn-ghost"}`} onClick={() => setSelRole(null)}>All ({users.length})</button>
              {ALL_ROLES.map(r => <button key={r} className={`btn btn-sm ${selRole===r?"btn-primary":"btn-secondary"}`} onClick={() => setSelRole(selRole===r?null:r)} style={{ borderColor: getRoleColor(r)+"50" }}>{getRoleDisplayName(r)} ({users.filter(u=>u.role===r).length})</button>)}
            </div>
            <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14}/>Add Staff</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead><tr><th>Staff Member</th><th>Role</th><th>Email</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {shown.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${getRoleColor(u.role)}20`, border: `1px solid ${getRoleColor(u.role)}40`, display: "flex", alignItems: "center", justifyContent: "center", color: getRoleColor(u.role), fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{u.name.charAt(0)}</div>
                        <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{u.name}</span>
                      </div>
                    </td>
                    <td><span className="badge" style={{ background: `${getRoleColor(u.role)}18`, color: getRoleColor(u.role), border: `1px solid ${getRoleColor(u.role)}40` }}>{getRoleDisplayName(u.role)}</span></td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(u.createdAt)}</td>
                    <td><button onClick={() => dispatch(toggleUserStatus(u.id))} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: u.isActive?"var(--success)":"var(--text-muted)", fontSize: 13, padding: 0 }}>{u.isActive?<UserCheck size={15}/>:<UserX size={15}/>}{u.isActive?"Active":"Inactive"}</button></td>
                    <td><div style={{ display: "flex", gap: 6 }}><button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(u)}><Edit2 size={13}/></button><button className="btn btn-danger btn-icon btn-sm" onClick={() => { if(window.confirm("Remove staff member?")) dispatch(deleteUser(u.id)); }}><Trash2 size={13}/></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>No staff members found</div>}
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing?"Edit Staff Member":"Add Staff Member"} maxWidth={480}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" required value={uf.name} onChange={e=>setUf({...uf,name:e.target.value})} placeholder="Alessandro Romano"/></div>
          <div className="form-group"><label className="form-label">Email Address *</label><input type="email" className="form-input" required value={uf.email} onChange={e=>setUf({...uf,email:e.target.value})} placeholder="staff@restaurant.com"/></div>
          <div className="form-group"><label className="form-label">Role *</label><select className="form-select" value={uf.role} onChange={e=>setUf({...uf,role:e.target.value as UserRole})}>{ALL_ROLES.map(r=><option key={r} value={r}>{getRoleDisplayName(r)}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={uf.isActive?"active":"inactive"} onChange={e=>setUf({...uf,isActive:e.target.value==="active"})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing?"Save Changes":"Add Staff Member"}</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default RolesPage;
