import { createSlice } from '@reduxjs/toolkit';

// Helper to get initial cart from localStorage
const getStoredCart = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const getStoredNote = () => {
  return localStorage.getItem('cart_order_note') || '';
};

const initialItems = getStoredCart();

// Helper to calculate totals
const calculateTotals = (items, appliedCoupon = null, shippingMethod = 'standard') => {
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      discount = Number(appliedCoupon.discountValue) || 0;
    }
  }

  // Free shipping above 999
  const shipping = subtotal >= 999 || subtotal === 0 ? (shippingMethod === 'express' ? 99 : 0) : (shippingMethod === 'express' ? 149 : 49);
  const total = Math.max(0, subtotal - discount + shipping);

  return { subtotal, discount, shipping, total };
};

const initialTotals = calculateTotals(initialItems);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialItems,
    subtotal: initialTotals.subtotal,
    discount: initialTotals.discount,
    shipping: initialTotals.shipping,
    total: initialTotals.total,
    appliedCoupon: null,
    orderNote: getStoredNote(),
    shippingMethod: 'standard',
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, size = 'M', color = 'Standard', quantity = 1 } = action.payload;
      const productId = product._id || product.id;
      const cartItemId = `${productId}_${size}_${color}`;

      const existingIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
      const itemPrice = Number(product.salePrice || product.price) || 0;
      const itemOldPrice = Number(product.oldPrice || product.price) || itemPrice;
      const itemImage = product.image || (product.images && product.images[0]) || '/images/prod_dress.jpg';

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += Number(quantity);
      } else {
        state.items.push({
          cartItemId,
          productId,
          name: product.name || 'Product',
          slug: product.slug || '',
          price: itemPrice,
          oldPrice: itemOldPrice,
          image: itemImage,
          size,
          color,
          quantity: Number(quantity),
          stock: product.stock ?? 50
        });
      }

      localStorage.setItem('cart', JSON.stringify(state.items));

      const totals = calculateTotals(state.items, state.appliedCoupon, state.shippingMethod);
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(it => it.cartItemId === cartItemId);
      if (item) {
        const newQty = Math.max(1, Number(quantity));
        if (item.stock && newQty > item.stock) {
          item.quantity = item.stock;
        } else {
          item.quantity = newQty;
        }
        localStorage.setItem('cart', JSON.stringify(state.items));
        
        const totals = calculateTotals(state.items, state.appliedCoupon, state.shippingMethod);
        state.subtotal = totals.subtotal;
        state.discount = totals.discount;
        state.shipping = totals.shipping;
        state.total = totals.total;
      }
    },

    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      state.items = state.items.filter(it => it.cartItemId !== cartItemId);
      localStorage.setItem('cart', JSON.stringify(state.items));

      const totals = calculateTotals(state.items, state.appliedCoupon, state.shippingMethod);
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.shipping = 0;
      state.total = 0;
      state.appliedCoupon = null;
      state.orderNote = '';
      localStorage.removeItem('cart');
      localStorage.removeItem('cart_order_note');
    },

    setOrderNote: (state, action) => {
      state.orderNote = action.payload || '';
      localStorage.setItem('cart_order_note', state.orderNote);
    },

    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
      const totals = calculateTotals(state.items, state.appliedCoupon, state.shippingMethod);
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },

    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      const totals = calculateTotals(state.items, state.appliedCoupon, state.shippingMethod);
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.shipping = totals.shipping;
      state.total = totals.total;
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      const totals = calculateTotals(state.items, null, state.shippingMethod);
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.shipping = totals.shipping;
      state.total = totals.total;
    }
  }
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setOrderNote,
  setShippingMethod,
  applyCoupon,
  removeCoupon
} = cartSlice.actions;

export default cartSlice.reducer;
