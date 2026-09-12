import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchBlogPosts = createAsyncThunk(
  'blog/fetchBlogPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/blog', { params });
      return res.posts || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminBlogPosts = createAsyncThunk(
  'blog/fetchAdminBlogPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/blog/admin/all', { params });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchPostBySlug = createAsyncThunk(
  'blog/fetchPostBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/blog/${slug}`);
      return res.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createBlogPost = createAsyncThunk(
  'blog/createBlogPost',
  async (postData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/blog', postData);
      return res.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  'blog/updateBlogPost',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/blog/${id}`, data);
      return res.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blog/deleteBlogPost',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/blog/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleBlogStatus = createAsyncThunk(
  'blog/toggleBlogStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/blog/${id}/status`);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleBlogFeatured = createAsyncThunk(
  'blog/toggleBlogFeatured',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/blog/${id}/feature`);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    items: [],
    currentPost: null,
    adminList: [],
    stats: { total: 0, published: 0, draft: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })
      .addCase(fetchAdminBlogPosts.fulfilled, (state, action) => {
        state.adminList = action.payload.posts || [];
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.adminList.unshift(action.payload);
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter((p) => p._id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
