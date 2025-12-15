import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials, clearError } from "../Store/slices/authSlice";

const AuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get("token");
                const userParam = params.get("user");

                if (!token || !userParam) {
                    throw new Error("Missing token or user data");
                }

                let userData;
                try {
                    userData = JSON.parse(decodeURIComponent(userParam));
                } catch (parseError) {
                    try {
                        userData = JSON.parse(userParam);
                    } catch (e) {
                        console.error("Failed to parse user data:", e);
                        throw new Error("Invalid user data format");
                    }
                }

                if (!userData || !userData.id) {
                    throw new Error("Invalid user data received");
                }

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));

                dispatch(
                    setCredentials({
                        user: userData,
                        token: token,
                        role: userData.role || "user",
                    }),
                );

                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);

                const redirectTo = localStorage.getItem("preAuthRoute") || "/";
                localStorage.removeItem("preAuthRoute");

                setTimeout(() => {
                    navigate(redirectTo, { replace: true });
                }, 100);
            } catch (error) {
                console.error("Error processing OAuth callback:", error);
                setError(error.message || "Failed to process login");
                dispatch(clearError());

                setTimeout(() => {
                    navigate("/", {
                        replace: true,
                        state: {
                            error: error.message || "Failed to process login",
                        },
                    });
                }, 2000);
            }
        };

        handleCallback();
    }, [dispatch, navigate, location.search]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Login Error
                        </h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <p className="text-sm text-gray-500">
                            Redirecting to login page...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Completing Login
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we log you in...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthCallback;
