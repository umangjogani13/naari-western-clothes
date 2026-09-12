import { createSlice } from '@reduxjs/toolkit';

// Helper to get initial wishlist from localStorage
const getStoredWishlist = () => {
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialItems = getStoredWishlist();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: initialItems,
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      const exists = state.items.some(item => (item._id || item.id) === productId);

      if (!exists) {
        state.items.push({
          id: productId,
          _id: productId,
          name: product.name,
          price: Number(product.salePrice || product.price) || 0,
          oldPrice: Number(product.oldPrice || product.price) || 0,
          image: product.image || (product.images && product.images[0]) || '/images/prod_dress.jpg',
          category: product.category || 'Apparel',
          stock: product.stock ?? 50
        });
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },

    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => (item._id || item.id) !== productId);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      const exists = state.items.some(item => (item._id || item.id) === productId);

      if (exists) {
        state.items = state.items.filter(item => (item._id || item.id) !== productId);
      } else {
        state.items.push({
          id: productId,
          _id: productId,
          name: product.name,
          price: Number(product.salePrice || product.price) || 0,
          oldPrice: Number(product.oldPrice || product.price) || 0,
          image: product.image || (product.images && product.images[0]) || '/images/prod_dress.jpg',
          category: product.category || 'Apparel',
          stock: product.stock ?? 50
        });
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },

    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    }
  }
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
