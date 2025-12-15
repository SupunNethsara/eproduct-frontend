import { useDispatch } from "react-redux";
import { addToast } from "../../Store/slices/toastSlice.js";
import { useNavigate } from "react-router-dom";

export const useToast = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showToast = (options) => {
        if (options.type === "confirm") {
            const toastId = `confirm-${Date.now()}`;
            dispatch(
                addToast({
                    ...options,
                    id: toastId,
                    type: "warning",
                    isConfirm: true,
                    duration: 0,
                }),
            );
            return toastId;
        }

        dispatch(
            addToast({
                ...options,
                id:
                    options.id ||
                    `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: options.type || "info",
                duration: options.duration ?? 5000,
            }),
        );
    };

    const success = (message, title = "Success", options = {}) => {
        showToast({
            type: "success",
            title,
            message,
            ...options,
        });
    };

    const error = (message, title = "Error", options = {}) => {
        showToast({
            type: "error",
            title,
            message,
            ...options,
        });
    };

    const warning = (message, title = "Warning", options = {}) => {
        showToast({
            type: "warning",
            title,
            message,
            ...options,
        });
    };

    const info = (message, title = "Info", options = {}) => {
        showToast({
            type: "info",
            title,
            message,
            ...options,
        });
    };

    return {
        showToast,
        success,
        error,
        warning,
        info,
    };
};

export default useToast;
