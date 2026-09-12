import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/coupons', { params });
      return res.coupons || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/coupons', couponData);
      return res.coupon;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/coupons/${id}`, data);
      return res.coupon;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/coupons/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'coupons/validateCoupon',
  async ({ code, cartTotal }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/coupons/validate', { code, cartTotal });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    items: [],
    appliedCoupon: null,
    loading: false,
    error: null,
  },
  reducers: {
    removeAppliedCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.items = state.items.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload && c.id !== action.payload);
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload.coupon;
      });
  },
});

export const { removeAppliedCoupon } = couponSlice.actions;
export default couponSlice.reducer;
