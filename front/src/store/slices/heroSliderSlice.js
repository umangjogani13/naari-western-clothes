import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchActiveHeroSlides = createAsyncThunk(
  'heroSlider/fetchActiveHeroSlides',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/hero-slider');
      return res.slides || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminHeroSlides = createAsyncThunk(
  'heroSlider/fetchAdminHeroSlides',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/hero-slider/admin');
      return res.slides || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createSlide = createAsyncThunk(
  'heroSlider/createSlide',
  async (slideData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/hero-slider', slideData);
      return res.slide;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateSlide = createAsyncThunk(
  'heroSlider/updateSlide',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/hero-slider/${id}`, data);
      return res.slide;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteSlide = createAsyncThunk(
  'heroSlider/deleteSlide',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/hero-slider/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleSlideStatus = createAsyncThunk(
  'heroSlider/toggleSlideStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/hero-slider/${id}/status`);
      return res.slide;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const heroSliderSlice = createSlice({
  name: 'heroSlider',
  initialState: {
    activeSlides: [],
    adminSlides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveHeroSlides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSlides = action.payload;
      })
      .addCase(fetchActiveHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.activeSlides = [];
        state.error = action.payload;
      })
      .addCase(fetchAdminHeroSlides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.adminSlides = action.payload;
      })
      .addCase(fetchAdminHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.adminSlides = [];
        state.error = action.payload;
      })
      .addCase(createSlide.fulfilled, (state, action) => {
        state.adminSlides.push(action.payload);
      })
      .addCase(updateSlide.fulfilled, (state, action) => {
        state.adminSlides = state.adminSlides.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      })
      .addCase(deleteSlide.fulfilled, (state, action) => {
        state.adminSlides = state.adminSlides.filter((s) => s._id !== action.payload);
      })
      .addCase(toggleSlideStatus.fulfilled, (state, action) => {
        state.adminSlides = state.adminSlides.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      });
  },
});

export default heroSliderSlice.reducer;
