import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/notifications';

// 1. Fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      );
    }
  }
);

// 2. Fetch unread count only
export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/unread-count`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch unread count'
      );
    }
  }
);

// 3. Mark single notification as read
export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);

// 4. Toggle single notification read status
export const toggleReadStatus = createAsyncThunk(
  'notifications/toggleReadStatus',
  async ({ id, isRead }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/toggle`, { isRead });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle notification status'
      );
    }
  }
);

// 5. Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/mark-all-read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark all as read'
      );
    }
  }
);

// 6. Delete a notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification'
      );
    }
  }
);

// 7. Clear all notifications
export const clearAllNotifications = createAsyncThunk(
  'notifications/clearAllNotifications',
  async (filter = 'all', { rejectWithValue }) => {
    try {
      const response = await axios.delete(API_URL, { params: { filter } });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear notifications'
      );
    }
  }
);

// 8. Create a notification
export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create notification'
      );
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  total: 0,
  loading: false,
  error: null,
  selectedNotification: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    }
  },
  extraReducers: (builder) => {
    // fetchNotifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.notifications || [];
      state.total = action.payload.total || action.payload.count || 0;
      state.unreadCount = action.payload.unreadCount !== undefined
        ? action.payload.unreadCount
        : state.items.filter((n) => !n.isRead).length;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // fetchUnreadCount
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      if (action.payload?.unreadCount !== undefined) {
        state.unreadCount = action.payload.unreadCount;
      }
    });

    // markAsRead
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const updated = action.payload.notification;
      if (updated) {
        const index = state.items.findIndex(
          (n) => n._id === updated._id || n.id === updated._id
        );
        if (index !== -1) {
          state.items[index] = updated;
        }
      }
      state.unreadCount = action.payload.unreadCount !== undefined
        ? action.payload.unreadCount
        : Math.max(0, state.unreadCount - 1);
      if (state.selectedNotification && state.selectedNotification._id === updated?._id) {
        state.selectedNotification = updated;
      }
    });

    // toggleReadStatus
    builder.addCase(toggleReadStatus.fulfilled, (state, action) => {
      const updated = action.payload.notification;
      if (updated) {
        const index = state.items.findIndex(
          (n) => n._id === updated._id || n.id === updated._id
        );
        if (index !== -1) {
          state.items[index] = updated;
        }
      }
      state.unreadCount = action.payload.unreadCount !== undefined
        ? action.payload.unreadCount
        : state.items.filter((n) => !n.isRead).length;
      if (state.selectedNotification && state.selectedNotification._id === updated?._id) {
        state.selectedNotification = updated;
      }
    });

    // markAllAsRead
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.items = state.items.map((n) => ({ ...n, isRead: true, readAt: new Date() }));
      state.unreadCount = 0;
      if (state.selectedNotification) {
        state.selectedNotification = {
          ...state.selectedNotification,
          isRead: true,
          readAt: new Date()
        };
      }
    });

    // deleteNotification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      const deletedId = action.payload.id;
      const target = state.items.find((n) => n._id === deletedId || n.id === deletedId);
      if (target && !target.isRead && state.unreadCount > 0) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter(
        (n) => n._id !== deletedId && n.id !== deletedId
      );
      state.total = Math.max(0, state.total - 1);
      if (state.selectedNotification && (state.selectedNotification._id === deletedId || state.selectedNotification.id === deletedId)) {
        state.selectedNotification = null;
      }
    });

    // clearAllNotifications
    builder.addCase(clearAllNotifications.fulfilled, (state, action) => {
      if (action.meta.arg === 'read') {
        state.items = state.items.filter((n) => !n.isRead);
      } else {
        state.items = [];
        state.unreadCount = 0;
        state.total = 0;
      }
      state.selectedNotification = null;
    });

    // createNotification
    builder.addCase(createNotification.fulfilled, (state, action) => {
      if (action.payload.notification) {
        state.items.unshift(action.payload.notification);
        state.total += 1;
        if (!action.payload.notification.isRead) {
          state.unreadCount += 1;
        }
      }
    });
  }
});

export const { setSelectedNotification, clearSelectedNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
