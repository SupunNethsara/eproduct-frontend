import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig.js";



api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
        return Promise.reject(error);
    },
);

// Async Thunks
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post("/register", userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await api.post("/verify-otp", otpData);
            // Store token and user data after successful verification
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user),
                );
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "OTP verification failed",
            );
        }
    },
);

export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post("/resend-otp", { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to resend OTP",
            );
        }
    },
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post("/login", credentials);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user),
                );
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed",
            );
        }
    },
);

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/user");
            return response.data;
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user",
            );
        }
    },
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await api.post("/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return;
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return rejectWithValue(
                error.response?.data?.message || "Logout failed",
            );
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: !!localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user")) || null,
        role: JSON.parse(localStorage.getItem("user"))?.role || null,
        isLoading: false,
        error: null,
        appLoaded: false,
        requiresVerification: false,
        pendingEmail: null,
        otpLoading: false,
        otpError: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.otpError = null;
        },
        setCredentials: (state, action) => {
            const { user, token, role } = action.payload;
            state.user = user;
            state.token = token;
            state.role = role || "user";
            state.isAuthenticated = true;
            state.error = null;
            state.appLoaded = true;
        },
        setAppLoaded: (state) => {
            state.appLoaded = true;
        },
        setRequiresVerification: (state, action) => {
            state.requiresVerification = true;
            state.pendingEmail = action.payload.email;
        },
        clearOtpState: (state) => {
            state.requiresVerification = false;
            state.pendingEmail = null;
            state.otpError = null;
        },
        clearPendingVerification: (state) => {
            state.requiresVerification = false;
            state.pendingEmail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // Check if OTP verification is required
                if (action.payload.requires_verification) {
                    state.requiresVerification = true;
                    state.pendingEmail = action.payload.email;
                    state.isAuthenticated = false;
                } else {
                    state.isAuthenticated = true;
                    state.user = action.payload.user;
                    state.role = action.payload.user?.role || "user";
                }
                state.appLoaded = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.appLoaded = true;
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.otpLoading = false;
                state.requiresVerification = false;
                state.pendingEmail = null;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.role = action.payload.user?.role || "user";
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.payload;
            })
            // Resend OTP
            .addCase(resendOtp.pending, (state) => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.otpLoading = false;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.role = action.payload.user?.role || "user";
                state.appLoaded = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.appLoaded = true;
            })
            // Fetch User
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.role = action.payload.role || "user";
                state.appLoaded = true;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.role = null;
                state.error = action.payload;
                state.appLoaded = true;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.role = null;
                state.error = null;
                state.requiresVerification = false;
                state.pendingEmail = null;
                state.appLoaded = true;
            });
    },
});

export const {
    setCredentials,
    clearError,
    setAppLoaded,
    setRequiresVerification,
    clearOtpState,
    clearPendingVerification,
} = authSlice.actions;

export default authSlice.reducer;
