import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Fetch orders with optional filters
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/orders', { params });
      return res.orders || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create new order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/orders', orderData);
      return res.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/orders/${id}/status`, { status });
      return { id, status: res.order.status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/orders/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.items = state.items.map((o) =>
          o._id === action.payload.id || o.id === action.payload.id
            ? { ...o, status: action.payload.status }
            : o
        );
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (o) => o._id !== action.payload && o.id !== action.payload
        );
      });
  },
});

export default orderSlice.reducer;
