import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isTokenValid, setIsTokenValid] = useState(null);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        if (token && email) {
            verifyToken();
        } else {
            setError("Invalid reset link. Please request a new reset link.");
            setIsTokenValid(false);
        }
    }, [token, email]);

    const verifyToken = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/verify-reset-token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: token,
                        email: decodeURIComponent(email),
                    }),
                },
            );

            const data = await response.json();
            setIsTokenValid(data.status);

            if (!data.status) {
                setError(
                    data.message ||
                        "This reset link is invalid or has expired.",
                );
            }
        } catch (err) {
            setError("Unable to verify reset link. Please try again.");
            setIsTokenValid(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: token,
                        email: decodeURIComponent(email),
                        password: formData.password,
                        password_confirmation: formData.password_confirmation,
                    }),
                },
            );

            const data = await response.json();

            if (data.status) {
                setSuccess(
                    "Password reset successfully! Redirecting to login...",
                );
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setError(
                    data.message ||
                        "Failed to reset password. Please try again.",
                );
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleRequestNewLink = () => {
        navigate("/");
    };

    if (isTokenValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center">
                        <Loader2
                            size={48}
                            className="animate-spin text-green-500 mx-auto"
                        />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Verifying Reset Link
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Please wait while we verify your reset link...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center">
                        <XCircle size={48} className="text-red-500 mx-auto" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Invalid Reset Link
                        </h2>
                        <p className="mt-2 text-gray-600">{error}</p>
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={handleRequestNewLink}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-colors duration-200"
                            >
                                Get New Reset Link
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <CheckCircle size={16} />
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-slate-50/50"
                                    placeholder="Enter new password (min. 8 characters)"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    required
                                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-slate-50/50"
                                    placeholder="Confirm new password"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2
                                        size={20}
                                        className="animate-spin"
                                    />
                                    Resetting Password...
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
