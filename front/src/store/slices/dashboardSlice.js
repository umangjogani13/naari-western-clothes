import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/dashboard/stats');
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalSales: '₹0',
      rawSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      pendingOrders: 0,
      returnRequests: 0,
      lowStockCount: 0,
    },
    chartData: { days: [], sales: [] },
    recentOrders: [],
    lowStockAlerts: [],
    topSellingCategories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || state.stats;
        state.chartData = action.payload.chartData || state.chartData;
        state.recentOrders = action.payload.recentOrders || [];
        state.lowStockAlerts = action.payload.lowStockAlerts || [];
        state.topSellingCategories = action.payload.topSellingCategories || [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
