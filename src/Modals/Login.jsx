import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Store/slices/authSlice.js";
import { setCredentials, clearError } from "../Store/slices/authSlice";
import { closeModals, clearRedirect } from "../Store/slices/modalSlice.js";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const LoginModal = ({
    isOpen,
    onClose,
    onSwitchToRegister,
    onSwitchToForgotPassword,
}) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] =
        useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { redirectAfterLogin } = useSelector((state) => state.modal);
    const { isLoading, error, isAuthenticated, role } = useSelector(
        (state) => state.auth,
    );

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            const userParam = urlParams.get("user");
            const error = urlParams.get("error");

            if (error) {
                console.error("OAuth Error:", error);
                dispatch(clearError());
                return;
            }

            if (token && userParam) {
                try {
                    let userData;
                    try {
                        userData = JSON.parse(decodeURIComponent(userParam));
                    } catch (e) {
                        userData = JSON.parse(userParam);
                    }

                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(userData));

                    await dispatch(
                        setCredentials({
                            user: userData,
                            token: token,
                            role: userData.role || "user",
                        }),
                    );

                    const cleanUrl = window.location.pathname;
                    window.history.replaceState({}, document.title, cleanUrl);

                    const redirectTo =
                        localStorage.getItem("preAuthRoute") || "/";
                    localStorage.removeItem("preAuthRoute");

                    if (isOpen) {
                        dispatch(closeModals());
                    }
                    navigate(redirectTo, { replace: true });
                } catch (error) {
                    console.error("Error handling OAuth callback:", error);
                    dispatch(clearError());
                }
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("token") && urlParams.has("user")) {
            handleOAuthCallback();
        }
    }, [dispatch, navigate, isOpen]);

    useEffect(() => {
        if (isAuthenticated && isOpen) {
            dispatch(closeModals());

            if (redirectAfterLogin) {
                if (
                    (redirectAfterLogin.includes("admin") &&
                        role !== "admin" &&
                        role !== "super_admin") ||
                    (redirectAfterLogin.includes("super-admin") &&
                        role !== "super_admin")
                ) {
                    navigate("/");
                    dispatch(clearRedirect());
                    return;
                }
                navigate(redirectAfterLogin);
                dispatch(clearRedirect());
            } else {
                if (role === "super_admin") {
                    navigate("/super-admin");
                } else if (role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        }
    }, [isAuthenticated, isOpen, navigate, role, redirectAfterLogin, dispatch]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            setForgotPasswordMessage("");
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleGoogleLogin = () => {
        localStorage.setItem("preAuthRoute", window.location.pathname);
        window.location.href = "http://localhost:8000/api/auth/google";
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setForgotPasswordMessage("Please enter your email address first");
            return;
        }

        setIsForgotPasswordLoading(true);
        setForgotPasswordMessage("");

        try {
            const response = await fetch(
                "http://localhost:8000/api/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: formData.email }),
                },
            );

            const data = await response.json();

            if (data.status) {
                setForgotPasswordMessage(
                    "Password reset link sent! Check your email.",
                );
            } else {
                setForgotPasswordMessage(
                    data.message || "Failed to send reset link",
                );
            }
        } catch (err) {
            setForgotPasswordMessage("Network error. Please try again.");
        } finally {
            setIsForgotPasswordLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSwitchToForgotPassword = () => {
        onClose();
        if (onSwitchToForgotPassword) {
            onSwitchToForgotPassword();
        }
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
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-blue-100">
                            Sign in to your account to continue
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

                    {forgotPasswordMessage && (
                        <div
                            className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
                                forgotPasswordMessage.includes("sent")
                                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                                    : "bg-blue-50 border border-blue-200 text-blue-700"
                            }`}
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    forgotPasswordMessage.includes("sent")
                                        ? "bg-blue-500"
                                        : "bg-blue-500"
                                }`}
                            ></div>
                            {forgotPasswordMessage}
                        </div>
                    )}

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
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={isForgotPasswordLoading}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isForgotPasswordLoading ? (
                                        <div className="flex items-center gap-1">
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />
                                            Sending...
                                        </div>
                                    ) : (
                                        "Forgot password?"
                                    )}
                                </button>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50/50"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
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
                                <Loader2 size={20} className="animate-spin" />
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                    >
                        <FcGoogle size={20} />
                        <span>Sign in with Google</span>
                    </button>

                    <div className="text-center pt-4 border-t border-slate-100">
                        <p className="text-slate-600">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                            >
                                Create one now
                            </button>
                        </p>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleSwitchToForgotPassword}
                            className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200"
                        >
                            Need help signing in?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
