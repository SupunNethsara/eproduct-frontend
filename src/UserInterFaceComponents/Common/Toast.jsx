import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    X,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { removeToast } from "../../Store/slices/toastSlice";

const Toast = () => {
    const dispatch = useDispatch();
    const { toasts } = useSelector((state) => state.toast);
    const timeouts = useRef({});

    useEffect(() => {
        toasts.forEach((toast) => {
            if (toast.autoHide !== false && !timeouts.current[toast.id]) {
                timeouts.current[toast.id] = setTimeout(() => {
                    dispatch(removeToast(toast.id));
                    delete timeouts.current[toast.id];
                }, toast.duration || 5000);
            }
        });

        return () => {
            Object.values(timeouts.current).forEach(clearTimeout);
        };
    }, [toasts, dispatch]);

    const getToastConfig = (type) => {
        const configs = {
            success: {
                icon: <CheckCircle className="w-5 h-5" />,
                bg: "bg-green-50",
                text: "text-green-800",
                border: "border-green-200",
                progress: "bg-green-500",
            },
            error: {
                icon: <XCircle className="w-5 h-5" />,
                bg: "bg-red-50",
                text: "text-red-800",
                border: "border-red-200",
                progress: "bg-red-500",
            },
            warning: {
                icon: <AlertTriangle className="w-5 h-5" />,
                bg: "bg-yellow-50",
                text: "text-yellow-800",
                border: "border-yellow-200",
                progress: "bg-yellow-500",
            },
            info: {
                icon: <Info className="w-5 h-5" />,
                bg: "bg-blue-50",
                text: "text-blue-800",
                border: "border-blue-200",
                progress: "bg-blue-500",
            },
            loading: {
                icon: <Loader2 className="w-5 h-5 animate-spin" />,
                bg: "bg-gray-50",
                text: "text-gray-800",
                border: "border-gray-200",
                progress: "bg-gray-500",
            },
        };

        return configs[type] || configs.info;
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 w-full max-w-sm">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const { icon, bg, text, border, progress } = getToastConfig(
                        toast.type,
                    );

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ duration: 0.2 }}
                            className={`relative rounded-xl p-4 shadow-lg ${bg} ${border} border-l-4 ${border.split("-")[0]}-500`}
                        >
                            <div className="flex items-start">
                                <div className={`flex-shrink-0 ${text}`}>
                                    {icon}
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p
                                        className={`text-sm font-medium ${text}`}
                                    >
                                        {toast.title}
                                    </p>
                                    {toast.message && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            {toast.message}
                                        </p>
                                    )}
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        onClick={() => {
                                            clearTimeout(
                                                timeouts.current[toast.id],
                                            );
                                            delete timeouts.current[toast.id];
                                            dispatch(removeToast(toast.id));
                                        }}
                                        className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            {toast.autoHide !== false && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-opacity-20 bg-gray-300 overflow-hidden">
                                    <motion.div
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{
                                            duration:
                                                (toast.duration || 5000) / 1000,
                                            ease: "linear",
                                        }}
                                        className={`h-full ${progress}`}
                                    />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
