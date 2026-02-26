import { configureStore } from "@reduxjs/toolkit";
import authReducer      from "./slices/authSlice";
import foodReducer      from "./slices/foodSlice";
import inventoryReducer from "./slices/inventorySlice";
import rolesReducer     from "./slices/rolesSlice";
import uiReducer        from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    food:      foodReducer,
    inventory: inventoryReducer,
    roles:     rolesReducer,
    ui:        uiReducer,
  },
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
