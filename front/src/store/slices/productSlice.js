import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Fetch products with optional query params
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/products', { params });
      return res.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/products/${id}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch new arrivals
export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async (limit = 8, { rejectWithValue }) => {
    try {
      let res = await axiosClient.get(`/products?newArrival=true&limit=${limit}`);
      if (!res?.success || !Array.isArray(res.products) || res.products.length === 0) {
        res = await axiosClient.get(`/products?limit=${limit}`);
      }
      return res.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch bestsellers
export const fetchBestsellers = createAsyncThunk(
  'products/fetchBestsellers',
  async (limit = 6, { rejectWithValue }) => {
    try {
      let res = await axiosClient.get(`/products?bestseller=true&limit=${limit}`);
      if (!res?.success || !Array.isArray(res.products) || res.products.length === 0) {
        res = await axiosClient.get(`/products?sort=popular&limit=${limit}`);
      }
      return res.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Create product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/products', productData);
      return res.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/products/${id}`, data);
      return res.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Fetch all products with stats & filters
export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/products/admin', { params });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Toggle product status
export const toggleProductStatus = createAsyncThunk(
  'products/toggleProductStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/products/${id}/status`);
      return { id, status: res.status, product: res.product };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Update product stock
export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ id, stock }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/products/${id}/stock`, { stock });
      return { id, stock: res.stock, status: res.status, product: res.product };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Admin: Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    adminList: [],
    stats: { total: 0, active: 0, outOfStock: 0, categoriesCount: 0 },
    newArrivals: [],
    bestsellers: [],
    currentProduct: null,
    relatedProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      // Fetch Admin Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload.products || [];
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.adminList = [];
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.product || null;
        state.relatedProducts = action.payload.related || [];
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProduct = null;
      })
      // New Arrivals
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
      })
      // Bestsellers
      .addCase(fetchBestsellers.fulfilled, (state, action) => {
        state.bestsellers = action.payload;
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.adminList.unshift(action.payload);
        state.stats.total += 1;
        if (action.payload.status === 'Active') state.stats.active += 1;
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.items = state.items.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        state.adminList = state.adminList.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
        state.adminList = state.adminList.filter((p) => p._id !== action.payload);
        state.stats.total = Math.max(0, state.stats.total - 1);
      })
      // Toggle Product Status
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.items = state.items.map((p) => (p._id === id || p.id === id) ? { ...p, status } : p);
        state.adminList = state.adminList.map((p) => (p._id === id || p.id === id) ? { ...p, status } : p);
      })
      // Update Product Stock
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const { id, stock, status } = action.payload;
        state.items = state.items.map((p) => (p._id === id || p.id === id) ? { ...p, stock, status } : p);
        state.adminList = state.adminList.map((p) => (p._id === id || p.id === id) ? { ...p, stock, status } : p);
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
