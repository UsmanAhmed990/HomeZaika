import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingInfo: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const isItemExist = state.cartItems.find(i => i.food === item.food);

            if (isItemExist) {
                state.cartItems = state.cartItems.map(i =>
                    i.food === isItemExist.food ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                state.cartItems.push(item);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        updateQuantity: (state, action) => {
            const { food, quantity } = action.payload;
            state.cartItems = state.cartItems.map(i =>
                i.food === food ? { ...i, quantity: Math.max(1, quantity) } : i
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(i => i.food !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.shippingInfo = {};
            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingInfo');
        }
    }
});

export const { addToCart, updateQuantity, removeFromCart, saveShippingInfo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
