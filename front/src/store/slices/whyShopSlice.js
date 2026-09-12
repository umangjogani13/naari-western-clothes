import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchWhyShop = createAsyncThunk(
  'whyShop/fetchWhyShop',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/why-shop');
      return res.data || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchWhyShopAdmin = createAsyncThunk(
  'whyShop/fetchWhyShopAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/why-shop/admin');
      return res.data || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateWhyShop = createAsyncThunk(
  'whyShop/updateWhyShop',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put('/why-shop', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const whyShopSlice = createSlice({
  name: 'whyShop',
  initialState: {
    data: null,
    adminData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhyShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWhyShop.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWhyShop.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload;
      })
      .addCase(fetchWhyShopAdmin.fulfilled, (state, action) => {
        state.adminData = action.payload;
      })
      .addCase(updateWhyShop.fulfilled, (state, action) => {
        state.adminData = action.payload;
        state.data = action.payload;
      });
  },
});

export default whyShopSlice.reducer;
