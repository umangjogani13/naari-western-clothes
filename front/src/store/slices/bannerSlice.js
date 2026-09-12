import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (placement = '', { rejectWithValue }) => {
    try {
      const url = placement ? `/banners?placement=${encodeURIComponent(placement)}` : '/banners';
      const res = await axiosClient.get(url);
      return res.banners || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminBanners = createAsyncThunk(
  'banners/fetchAdminBanners',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/banners/admin', { params });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createBanner = createAsyncThunk(
  'banners/createBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/banners', bannerData);
      return res.banner;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/banners/${id}`, data);
      return res.banner;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/banners/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleBannerStatus = createAsyncThunk(
  'banners/toggleBannerStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/banners/${id}/status`);
      return res.banner;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    items: [],
    adminList: [],
    stats: { total: 0, active: 0, inactive: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })
      .addCase(fetchAdminBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload.banners || [];
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchAdminBanners.rejected, (state, action) => {
        state.loading = false;
        state.adminList = [];
        state.error = action.payload;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.adminList.unshift(action.payload);
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter((b) => b._id !== action.payload);
      })
      .addCase(toggleBannerStatus.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      });
  },
});

export default bannerSlice.reducer;
