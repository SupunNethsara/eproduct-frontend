import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    ProtectedRoute,
    AdminRoute,
    SuperAdminRoute,
} from "./UserInterFaceComponents/Common/ProtectedRoute.jsx";
import { fetchUser } from "./Store/slices/authSlice.js";
import NormalLayout from "./layouts/NormalLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./Dashboards/AdminDashboard.jsx";
import SuperAdminDashboard from "./Dashboards/SuperAdminDashboard.jsx";
import SuperAdminLayout from "./Layouts/SuperAdminLayout.jsx";
import CheckOutUser from "./UserInterFaceComponents/Products/CheckOut/CheckOutUser.jsx";
import ProductDetails from "./UserInterFaceComponents/Products/ProductDetails.jsx";
import UserInterFace from "./UserInterFaceComponents/Common/UserInterFace.jsx";
import AuthCallback from "./pages/AuthCallback";
import UserProfile from "./UserInterFaceComponents/Common/UserProfileRoutes/UserProfile.jsx";
import Toast from "./UserInterFaceComponents/Common/Toast.jsx";
import OrderConfirmation from "./UserInterFaceComponents/Common/OrderConfirmation.jsx";
import GlobalModals from "./GlobalModels/GlobalModals.jsx";
import ResetPasswordPage from "./Modals/ResetPasswordPage.jsx";
import QuoteViewDetails from "./UserInterFaceComponents/Quotations/QuoteViewDetails.jsx";
import QuotationsPage from "./UserInterFaceComponents/Quotations/QuotationsPage.jsx";

function App() {
    const dispatch = useDispatch();
    const { isLoading, appLoaded } = useSelector((state) => state.auth);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(fetchUser()).finally(() => {
                setInitialLoad(false);
            });
        } else {
            setInitialLoad(false);
        }
    }, [dispatch]);

    if (initialLoad || (isLoading && !appLoaded)) {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <div className="text-center space-y-8">
                    <div className="flex justify-center space-x-3">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            ></div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700 font-medium text-lg">
                            Loading
                        </p>
                        <p className="text-slate-400 text-sm">
                            Please wait while we set things up
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <Router>
            <GlobalModals />
            <div className="App">
                <Routes>
                    <Route
                        path="/auth/google/callback"
                        element={<AuthCallback />}
                    />
                    <Route
                        path="/reset-password"
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path="/*"
                        element={
                            <NormalLayout>
                                <UserInterFace />
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <NormalLayout>
                                <ProtectedRoute>
                                    <CheckOutUser />
                                </ProtectedRoute>
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/order-confirmation"
                        element={
                            <NormalLayout>
                                <ProtectedRoute>
                                    <OrderConfirmation />
                                </ProtectedRoute>
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <NormalLayout>
                                <ProtectedRoute>
                                    <UserProfile />
                                </ProtectedRoute>
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/productDetails/:id?"
                        element={
                            <NormalLayout>
                                <ProductDetails />
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/quoteDetails/:id?"
                        element={
                            <NormalLayout>
                                <QuoteViewDetails />
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/quotationsPage"
                        element={
                            <NormalLayout>
                                <QuotationsPage />
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/admin/*"
                        element={
                            <AdminRoute>
                                <AdminLayout>
                                    <AdminDashboard />
                                </AdminLayout>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/super-admin/*"
                        element={
                            <SuperAdminRoute>
                                <SuperAdminLayout>
                                    <SuperAdminDashboard />
                                </SuperAdminLayout>
                            </SuperAdminRoute>
                        }
                    />
                    <Route
                        path="/unauthorized"
                        element={
                            <NormalLayout>
                                <div>Unauthorized Access</div>
                            </NormalLayout>
                        }
                    />
                </Routes>
                <Toast />
            </div>
        </Router>
    );
}

export default App;
