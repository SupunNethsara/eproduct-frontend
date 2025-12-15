import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "../Modals/Login.jsx";
import RegisterModal from "../Modals/Register.jsx";
import {
    closeModals,
    switchToRegister,
    switchToLogin,
} from "../Store/slices/modalSlice.js";
import ForgotPasswordModal from "../Modals/ForgotPasswordModal.jsx";

const GlobalModals = () => {
    const dispatch = useDispatch();
    const { isLoginModalOpen, isRegisterModalOpen } = useSelector(
        (state) => state.modal,
    );

    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
        useState(false);

    const handleOpenForgotPassword = () => {
        dispatch(closeModals());
        setIsForgotPasswordModalOpen(true);
    };

    const handleCloseForgotPassword = () => {
        setIsForgotPasswordModalOpen(false);
    };

    const handleSwitchToLoginFromForgot = () => {
        setIsForgotPasswordModalOpen(false);
        dispatch(switchToLogin());
    };

    return (
        <>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => dispatch(closeModals())}
                onSwitchToRegister={() => dispatch(switchToRegister())}
                onSwitchToForgotPassword={handleOpenForgotPassword}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => dispatch(closeModals())}
                onSwitchToLogin={() => dispatch(switchToLogin())}
            />

            <ForgotPasswordModal
                isOpen={isForgotPasswordModalOpen}
                onClose={handleCloseForgotPassword}
                onSwitchToLogin={handleSwitchToLoginFromForgot}
            />
        </>
    );
};

export default GlobalModals;
