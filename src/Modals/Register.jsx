import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, registerUser, setRequiresVerification } from "../Store/slices/authSlice";
import { X, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import OtpVerificationModal from "./OtpVerificationModal.jsx";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const dispatch = useDispatch();
    const {
        isLoading,
        error,
        isAuthenticated,
        requiresVerification,
        pendingEmail
    } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && isOpen) {
            onClose();
        }
    }, [isAuthenticated, isOpen, onClose]);

    useEffect(() => {
        if (requiresVerification && pendingEmail) {
            setShowOtpModal(true);
        }
    }, [requiresVerification, pendingEmail]);

    useEffect(() => {
        if (isOpen) {
            dispatch(clearError());
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 'user'
            });
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, dispatch]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            dispatch(clearError());
            return;
        }

        const result = await dispatch(registerUser(formData));

        if (registerUser.fulfilled.match(result)) {
            if (result.payload.requires_verification) {
                dispatch(setRequiresVerification({ email: result.payload.email }));
            } else {
                onClose();
            }
        }
    };

    const handleOtpVerificationSuccess = (data) => {
        setShowOtpModal(false);
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleOtpModalClose = () => {
        setShowOtpModal(false);
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 overflow-hidden max-h-[90vh] overflow-y-auto">
                    <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-8 sticky top-0">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
                        >
                            <X size={20} />
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Join Us Today
                            </h2>
                            <p className="text-blue-100">
                                Create your account to get started
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

                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User
                                        size={20}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50/50"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
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
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
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
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={20}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50/50"
                                        placeholder="Confirm your password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-slate-100">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <OtpVerificationModal
                isOpen={showOtpModal}
                onClose={handleOtpModalClose}
                email={pendingEmail}
                onVerificationSuccess={handleOtpVerificationSuccess}
            />
        </>
    );
};

export default RegisterModal;
