import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        isLoginModalOpen: false,
        isRegisterModalOpen: false,
        isConfirmationModalOpen: false,
        confirmationModalProps: {
            message: "",
            onConfirm: null,
            onCancel: null,
        },
        redirectAfterLogin: null,
    },
    reducers: {
        openLoginModal: (state, action) => {
            state.isLoginModalOpen = true;
            state.isRegisterModalOpen = false;
            state.isConfirmationModalOpen = false;
            state.redirectAfterLogin = action.payload || null;
        },
        openRegisterModal: (state, action) => {
            state.isRegisterModalOpen = true;
            state.isLoginModalOpen = false;
            state.isConfirmationModalOpen = false;
            state.redirectAfterLogin = action.payload || null;
        },
        openConfirmationModal: (state, action) => {
            state.isConfirmationModalOpen = true;
            state.confirmationModalProps = {
                ...state.confirmationModalProps,
                ...action.payload,
            };
        },
        closeModals: (state) => {
            state.isLoginModalOpen = false;
            state.isRegisterModalOpen = false;
            state.isConfirmationModalOpen = false;
            state.redirectAfterLogin = null;
            state.confirmationModalProps = {
                message: "",
                onConfirm: null,
                onCancel: null,
            };
        },
        confirmAction: (state) => {
            if (state.confirmationModalProps.onConfirm) {
                state.confirmationModalProps.onConfirm();
            }
            state.isConfirmationModalOpen = false;
            state.confirmationModalProps = {
                message: "",
                onConfirm: null,
                onCancel: null,
            };
        },
        cancelAction: (state) => {
            if (state.confirmationModalProps.onCancel) {
                state.confirmationModalProps.onCancel();
            }
            state.isConfirmationModalOpen = false;
            state.confirmationModalProps = {
                message: "",
                onConfirm: null,
                onCancel: null,
            };
        },
        switchToRegister: (state) => {
            state.isLoginModalOpen = false;
            state.isRegisterModalOpen = true;
        },
        switchToLogin: (state) => {
            state.isRegisterModalOpen = false;
            state.isLoginModalOpen = true;
        },
        clearRedirect: (state) => {
            state.redirectAfterLogin = null;
        },
    },
});

export const {
    openLoginModal,
    openRegisterModal,
    openConfirmationModal,
    closeModals,
    switchToRegister,
    switchToLogin,
    clearRedirect,
    confirmAction,
    cancelAction,
} = modalSlice.actions;

export default modalSlice.reducer;
