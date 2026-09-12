import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchFeaturedReviews = createAsyncThunk(
  'reviews/fetchFeaturedReviews',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/reviews/featured');
      return res.testimonials || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/reviews', { params });
      return res.reviews || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminReviews = createAsyncThunk(
  'reviews/fetchAdminReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/reviews/admin', { params });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/reviews', reviewData);
      return res.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/reviews/${id}`, data);
      return res.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/reviews/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleReviewStatus = createAsyncThunk(
  'reviews/toggleReviewStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/reviews/${id}/status`);
      return res.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleReviewFeatured = createAsyncThunk(
  'reviews/toggleReviewFeatured',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/reviews/${id}/featured`);
      return res.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    featured: [],
    items: [],
    adminList: [],
    stats: { total: 0, published: 0, pending: 0, avgRating: 5.0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedReviews.rejected, (state, action) => {
        state.loading = false;
        state.featured = [];
        state.error = action.payload;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.adminList = action.payload.reviews || [];
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.adminList.unshift(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter((r) => r._id !== action.payload);
      })
      .addCase(toggleReviewStatus.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })
      .addCase(toggleReviewFeatured.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      });
  },
});

export default reviewSlice.reducer;
