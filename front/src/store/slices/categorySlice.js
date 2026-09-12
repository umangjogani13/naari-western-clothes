import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Public: Fetch active categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/categories');
      return res.categories || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Public: Fetch featured categories for Home page
export const fetchFeaturedCategories = createAsyncThunk(
  'categories/fetchFeaturedCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/categories/featured');
      return res.categories || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Public: Fetch category by slug
export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/categories/${slug}`);
      return res.category;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Fetch categories with stats and filters
export const fetchAdminCategories = createAsyncThunk(
  'categories/fetchAdminCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/categories/admin', { params });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Create category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/categories', categoryData);
      return res.category;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Update category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/categories/${id}`, data);
      return res.category;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Delete category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Toggle category status
export const toggleCategoryStatus = createAsyncThunk(
  'categories/toggleCategoryStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/categories/${id}/status`);
      return res.category;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Toggle category featured
export const toggleCategoryFeatured = createAsyncThunk(
  'categories/toggleCategoryFeatured',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/categories/${id}/featured`);
      return res.category;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    featured: [],
    currentCategory: null,
    adminList: [],
    stats: { total: 0, active: 0, inactive: 0, featured: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch public categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      // Featured categories
      .addCase(fetchFeaturedCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedCategories.rejected, (state, action) => {
        state.loading = false;
        state.featured = [];
      })
      // Category by slug
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
      })
      // Admin list
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload.categories || [];
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.adminList = [];
        state.error = action.payload;
      })
      // Mutations
      .addCase(createCategory.fulfilled, (state, action) => {
        state.adminList.unshift(action.payload);
        state.stats.total += 1;
        if (action.payload.status === 'Active') state.stats.active += 1;
        if (action.payload.isFeatured) state.stats.featured += 1;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter((c) => c._id !== action.payload);
        state.stats.total = Math.max(0, state.stats.total - 1);
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((c) =>
          c._id === action.payload._id ? { ...c, status: action.payload.status } : c
        );
      })
      .addCase(toggleCategoryFeatured.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((c) =>
          c._id === action.payload._id ? { ...c, isFeatured: action.payload.isFeatured } : c
        );
      });
  },
});

export const { clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
