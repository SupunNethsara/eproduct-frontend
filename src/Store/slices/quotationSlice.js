// Store/slices/quotationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper function to get product price (buy_now_price first, then price)
const getProductPrice = (product) => {
    return parseFloat(product?.buy_now_price || product?.price || 0);
};

// Async Thunks for Quotations
export const addToQuotation = createAsyncThunk(
    "quotation/addToQuotation",
    async ({ product_id, quantity }, { rejectWithValue }) => {
        try {
            const response = await api.post("/quotations", {
                product_id,
                quantity,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to quotation",
            );
        }
    },
);

export const fetchQuotations = createAsyncThunk(
    "quotation/fetchQuotations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/quotations");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch quotations",
            );
        }
    },
);

export const removeFromQuotation = createAsyncThunk(
    "quotation/removeFromQuotation",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/quotations/${id}`);
            return id;
        } catch (error) {
            if (error.response?.status === 404) {
                return id;
            }
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to remove from quotation",
            );
        }
    },
);

export const clearQuotations = createAsyncThunk(
    "quotation/clearQuotations",
    async (_, { rejectWithValue }) => {
        try {
            await api.delete("/quotations/clear");
            return { success: true };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to clear quotations",
            );
        }
    },
);

const quotationSlice = createSlice({
    name: "quotation",
    initialState: {
        items: [],
        loading: false,
        error: null,
        totalItems: 0,
        totalPrice: 0,
    },
    reducers: {
        clearQuotationError: (state) => {
            state.error = null;
        },
        clearQuotation: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Add to quotation
            .addCase(addToQuotation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToQuotation.fulfilled, (state, action) => {
                state.loading = false;
                const newItem = action.payload.item;
                const existingIndex = state.items.findIndex(
                    (item) => item.product_id === newItem.product_id,
                );

                if (existingIndex !== -1) {
                    state.items[existingIndex] = newItem;
                } else {
                    state.items.push(newItem);
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
            .addCase(addToQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch quotations
            .addCase(fetchQuotations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
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
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from quotation
            .addCase(removeFromQuotation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromQuotation.fulfilled, (state, action) => {
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
            .addCase(removeFromQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Clear quotations
            .addCase(clearQuotations.fulfilled, (state) => {
                state.items = [];
                state.totalItems = 0;
                state.totalPrice = 0;
                state.error = null;
            });
    },
});

export const { clearQuotationError, clearQuotation } = quotationSlice.actions;
export default quotationSlice.reducer;
