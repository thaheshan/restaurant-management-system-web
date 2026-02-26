import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RolesState, User } from "../../types";
import { mockRoles, mockUsers } from "../../utils/mockData";
import { generateId } from "../../utils/helpers";
const initialState: RolesState = { roles: mockRoles, users: mockUsers, loading: false, error: null };
const rolesSlice = createSlice({
  name: "roles", initialState,
  reducers: {
    addUser: (s, a: PayloadAction<Omit<User,"id"|"createdAt">>) => {
      const u = { ...a.payload, id: generateId(), createdAt: new Date().toISOString() };
      s.users.push(u);
      const r = s.roles.find(x => x.name === u.role); if (r) r.userCount += 1;
    },
    updateUser: (s, a: PayloadAction<User>) => {
      const i = s.users.findIndex(u => u.id === a.payload.id);
      if (i !== -1) {
        const old = s.users[i].role; const nw = a.payload.role; s.users[i] = a.payload;
        if (old !== nw) {
          const or = s.roles.find(r => r.name === old); const nr = s.roles.find(r => r.name === nw);
          if (or) or.userCount -= 1; if (nr) nr.userCount += 1;
        }
      }
    },
    deleteUser: (s, a: PayloadAction<string>) => {
      const u = s.users.find(x => x.id === a.payload);
      if (u) { const r = s.roles.find(x => x.name === u.role); if (r) r.userCount -= 1; }
      s.users = s.users.filter(x => x.id !== a.payload);
    },
    toggleUserStatus: (s, a: PayloadAction<string>) => {
      const u = s.users.find(x => x.id === a.payload); if (u) u.isActive = !u.isActive;
    },
  },
});
export const { addUser, updateUser, deleteUser, toggleUserStatus } = rolesSlice.actions;
export default rolesSlice.reducer;
