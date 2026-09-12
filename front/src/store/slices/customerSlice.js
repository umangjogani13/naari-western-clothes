import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/customers', { params });
      return res.customers || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/customers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload && c.id !== action.payload);
      });
  },
});

export default customerSlice.reducer;
