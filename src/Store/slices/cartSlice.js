import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart items",
            );
        }
    },
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ product_id, quantity }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/cart",
                { product_id, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to cart",
            );
        }
    },
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://127.0.0.1:8000/api/cart/${id}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update cart item",
            );
        }
    },
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/api/cart/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove from cart",
            );
        }
    },
);

export const clearServerCart = createAsyncThunk(
    "cart/clearServerCart",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await axios.delete(
                "http://127.0.0.1:8000/api/cart/clear",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                },
            );

            if (
                response.data &&
                (response.data.success || response.data.deleted_count >= 0)
            ) {
                return response.data;
            }

            throw new Error(response.data.message || "Failed to clear cart");
        } catch (error) {
            console.error("Error clearing cart:", error);
            if (
                error.response?.status === 404 ||
                error.response?.data?.message?.includes("Item not found") ||
                error.response?.data?.message?.includes("already empty")
            ) {
                return { success: true, message: "Cart is empty" };
            }
            return rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to clear cart",
            );
        }
    },
);

// Helper function to get product price (buy_now_price first, then price)
const getProductPrice = (product) => {
    return parseFloat(product?.buy_now_price || product?.price || 0);
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
        totalItems: 0,
        totalPrice: 0,
    },
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch cart items
            .addCase(fetchCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalItems = action.payload.reduce(
                    (total, item) => total + item.quantity,
                    0,
                );
                state.totalPrice = action.payload.reduce((total, item) => {
                    const productPrice = getProductPrice(item.product);
                    return total + productPrice * item.quantity;
                }, 0);
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const existingItemIndex = state.items.findIndex(
                    (item) =>
                        item.product_id === action.payload.item.product_id,
                );

                if (existingItemIndex !== -1) {
                    state.items[existingItemIndex] = action.payload.item;
                } else {
                    state.items.push(action.payload.item);
                }

                state.totalItems = state.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                );
                state.totalPrice = state.items.reduce((total, item) => {
                    const productPrice = getProductPrice(item.product);
                    return total + productPrice * item.quantity;
                }, 0);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(
                    (item) => item.id === action.payload.item.id,
                );
                if (index !== -1) {
                    const existingProduct = state.items[index].product;
                    state.items[index] = {
                        ...action.payload.item,
                        product: action.payload.item.product || existingProduct,
                    };
                }

                state.totalItems = state.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                );
                state.totalPrice = state.items.reduce((total, item) => {
                    const productPrice = getProductPrice(item.product);
                    return total + productPrice * item.quantity;
                }, 0);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(
                    (item) => item.id !== action.payload,
                );

                state.totalItems = state.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                );
                state.totalPrice = state.items.reduce((total, item) => {
                    const productPrice = getProductPrice(item.product);
                    return total + productPrice * item.quantity;
                }, 0);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Clear server cart
            .addCase(clearServerCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearServerCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.totalItems = 0;
                state.totalPrice = 0;
                state.error = null;
            })
            .addCase(clearServerCart.rejected, (state, action) => {
                state.loading = false;
                // Don't set error for "Item not found" - cart is already empty
                if (!action.payload?.includes("Item not found")) {
                    state.error = action.payload;
                }
                // Clear local state anyway since server cart is empty
                state.items = [];
                state.totalItems = 0;
                state.totalPrice = 0;
            });
    },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;
