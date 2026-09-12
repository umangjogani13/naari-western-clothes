import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchActiveValueProps = createAsyncThunk(
  'valueProps/fetchActiveValueProps',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/value-props');
      return res.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminValueProps = createAsyncThunk(
  'valueProps/fetchAdminValueProps',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/value-props/admin');
      return res.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createValueProp = createAsyncThunk(
  'valueProps/createValueProp',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/value-props', data);
      return res.item;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateValueProp = createAsyncThunk(
  'valueProps/updateValueProp',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/value-props/${id}`, data);
      return res.item;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteValueProp = createAsyncThunk(
  'valueProps/deleteValueProp',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/value-props/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleValuePropStatus = createAsyncThunk(
  'valueProps/toggleValuePropStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/value-props/${id}/status`);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const valuePropSlice = createSlice({
  name: 'valueProps',
  initialState: {
    items: [],
    adminList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveValueProps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveValueProps.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActiveValueProps.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })
      .addCase(fetchAdminValueProps.fulfilled, (state, action) => {
        state.adminList = action.payload;
      })
      .addCase(createValueProp.fulfilled, (state, action) => {
        state.adminList.push(action.payload);
      })
      .addCase(updateValueProp.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(deleteValueProp.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter((item) => item._id !== action.payload);
      });
  },
});

export default valuePropSlice.reducer;
