import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState, Notification } from "../../types";
import { generateId } from "../../utils/helpers";
const initialState: UIState = {
  sidebarOpen: true,
  notifications: [
    { id: "1", type: "warning", message: "Burrata stock critically low (8 pieces remaining)", timestamp: new Date().toISOString(), read: false },
    { id: "2", type: "warning", message: "Fresh Basil below minimum stock threshold",          timestamp: new Date().toISOString(), read: false },
    { id: "3", type: "info",    message: "3 new orders received in last 30 minutes",           timestamp: new Date().toISOString(), read: true  },
  ],
};
const uiSlice = createSlice({
  name: "ui", initialState,
  reducers: {
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },
    addNotification: (s, a: PayloadAction<Omit<Notification,"id"|"timestamp"|"read">>) => {
      s.notifications.unshift({ ...a.payload, id: generateId(), timestamp: new Date().toISOString(), read: false });
    },
    markAllRead: (s) => { s.notifications.forEach(n => (n.read = true)); },
  },
});
export const { toggleSidebar, addNotification, markAllRead } = uiSlice.actions;
export default uiSlice.reducer;
