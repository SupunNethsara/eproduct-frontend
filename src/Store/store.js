import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import modalReducer from "./slices/modalSlice";
import cartReducer from "./slices/cartSlice";
import toastReducer from "./slices/toastSlice";
import quotationReducer from "./slices/quotationSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        modal: modalReducer,
        cart: cartReducer,
        toast: toastReducer,
        quotation: quotationReducer,
    },
});
