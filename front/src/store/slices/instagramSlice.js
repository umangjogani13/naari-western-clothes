import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchInstagramPosts = createAsyncThunk(
  'instagram/fetchInstagramPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/instagram');
      return res.posts || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminInstagramPosts = createAsyncThunk(
  'instagram/fetchAdminInstagramPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/instagram/admin');
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createInstagramPost = createAsyncThunk(
  'instagram/createInstagramPost',
  async (postData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/instagram', postData);
      return res.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateInstagramPost = createAsyncThunk(
  'instagram/updateInstagramPost',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/instagram/${id}`, data);
      return res.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteInstagramPost = createAsyncThunk(
  'instagram/deleteInstagramPost',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/instagram/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleInstagramStatus = createAsyncThunk(
  'instagram/toggleInstagramStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/instagram/${id}/status`);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const instagramSlice = createSlice({
  name: 'instagram',
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
      .addCase(fetchInstagramPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstagramPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInstagramPosts.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })
      .addCase(fetchAdminInstagramPosts.fulfilled, (state, action) => {
        state.adminList = action.payload.posts || [];
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(createInstagramPost.fulfilled, (state, action) => {
        state.adminList.unshift(action.payload);
      })
      .addCase(updateInstagramPost.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteInstagramPost.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter((p) => p._id !== action.payload);
      });
  },
});

export default instagramSlice.reducer;
