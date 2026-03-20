import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import hygieneService from '@/app/src/services/hygieneService';

interface HygieneTask {
  id: number;
  title: string;
  area: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface HygieneState {
  tasks: HygieneTask[];
  loading: boolean;
  error: string | null;
}

const initialState: HygieneState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchHygieneTasks = createAsyncThunk(
  'hygiene/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await hygieneService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch hygiene tasks');
    }
  }
);

export const updateHygieneTask = createAsyncThunk(
  'hygiene/update',
  async ({ id, data }: { id: number; data: Partial<HygieneTask> }, { rejectWithValue }) => {
    try {
      return await hygieneService.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

const hygieneSlice = createSlice({
  name: 'hygiene',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHygieneTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHygieneTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchHygieneTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateHygieneTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      });
  },
});

export default hygieneSlice.reducer;
