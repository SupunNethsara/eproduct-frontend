import { useState } from "react";
import { X, Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:8000/api/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const data = await response.json();

            if (data.status) {
                setIsSubmitted(true);
            } else {
                setError(data.message || "Failed to send reset link");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleBackToLogin = () => {
        onClose();
        if (onSwitchToLogin) {
            onSwitchToLogin();
        }
    };

    const resetForm = () => {
        setEmail("");
        setIsSubmitted(false);
        setError("");
        setIsLoading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 overflow-hidden">
                <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-8">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
                    >
                        <X size={20} />
                    </button>
                    {!isSubmitted && (
                        <button
                            onClick={handleBackToLogin}
                            className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isSubmitted
                                ? "Check Your Email"
                                : "Reset Your Password"}
                        </h2>
                        <p className="text-blue-100">
                            {isSubmitted
                                ? "We sent you a reset link"
                                : "Enter your email to reset password"}
                        </p>
                    </div>
                </div>

                <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    {isSubmitted ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle
                                    size={48}
                                    className="text-green-500"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Check Your Email
                                </h3>
                                <p className="text-gray-600">
                                    We've sent a password reset link to{" "}
                                    <strong>{email}</strong>
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    The link will expire in 1 hour.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Send to another email
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="relative">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-700 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={20}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50/50"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />
                                        Sending...
                                    </div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>

                            <div className="text-center pt-4 border-t border-slate-100">
                                <p className="text-slate-600">
                                    Remember your password?{" "}
                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
