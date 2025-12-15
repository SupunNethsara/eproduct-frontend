import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, clearOtpState, clearPendingVerification } from '../Store/slices/authSlice';
import { X, Mail, Clock, RotateCcw, CheckCircle } from 'lucide-react';

const OtpVerificationModal = ({
                                  isOpen,
                                  onClose,
                                  email,
                                  onVerificationSuccess
                              }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(600);
    const [localError, setLocalError] = useState('');

    const inputRefs = useRef([]);
    const dispatch = useDispatch();

    const { otpLoading, otpError, requiresVerification } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            inputRefs.current[0]?.focus();
            document.body.style.overflow = 'hidden';
            setLocalError('');
        } else {
            document.body.style.overflow = 'unset';
            setOtp(['', '', '', '', '', '']);
            setTimeLeft(600);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (otpError) {
            setLocalError(otpError);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    }, [otpError]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setLocalError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedNumbers = pastedData.replace(/\D/g, '').split('').slice(0, 6);

        if (pastedNumbers.length === 6) {
            setOtp(pastedNumbers);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setLocalError('Please enter the complete 6-digit OTP');
            return;
        }

        if (!email) {
            setLocalError('Email is required for verification');
            return;
        }

        dispatch(clearOtpState());
        setLocalError('');

        const result = await dispatch(verifyOtp({
            email: email,
            otp: otpString
        }));

        if (verifyOtp.fulfilled.match(result)) {
            if (onVerificationSuccess) {
                onVerificationSuccess(result.payload);
            }
            handleClose();
        }
    };

    const handleResendOtp = async () => {
        if (timeLeft > 0) return;

        dispatch(clearOtpState());
        setLocalError('');

        const result = await dispatch(resendOtp(email));

        if (resendOtp.fulfilled.match(result)) {
            setTimeLeft(600);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    const handleClose = () => {
        dispatch(clearOtpState());
        dispatch(clearPendingVerification());
        setOtp(['', '', '', '', '', '']);
        setTimeLeft(600);
        setLocalError('');
        onClose();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-8">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Verify Your Email
                        </h2>
                        <p className="text-blue-100">
                            Enter the 6-digit code sent to <strong>{email}</strong>
                        </p>
                    </div>
                </div>

                <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                    {(localError || otpError) && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {localError || otpError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="text-center">
                            <label className="block text-sm font-medium text-slate-700 mb-4">
                                Enter verification code
                            </label>
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50/50"
                                        disabled={otpLoading}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
                                <Clock size={16} />
                                <span>Code expires in: {formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={timeLeft > 0 || otpLoading}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <RotateCcw size={16} />
                                {otpLoading ? 'Sending...' : 'Resend Code'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={otpLoading || otp.join('').length !== 6}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                    >
                        {otpLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Verifying...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle size={20} />
                                Verify Email
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerificationModal;
