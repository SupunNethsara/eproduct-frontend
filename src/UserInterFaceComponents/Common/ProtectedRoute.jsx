import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, appLoaded } = useSelector(
        (state) => state.auth,
    );
    const location = useLocation();

    if (isLoading && !appLoaded) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
};

export const AdminRoute = ({ children }) => {
    const { isAuthenticated, role, isLoading, appLoaded } = useSelector(
        (state) => state.auth,
    );
    const location = useLocation();

    if (isLoading && !appLoaded) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!["admin", "super_admin"].includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export const SuperAdminRoute = ({ children }) => {
    const { isAuthenticated, role, isLoading, appLoaded } = useSelector(
        (state) => state.auth,
    );
    const location = useLocation();

    if (isLoading && !appLoaded) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/home" state={{ from: location }} replace />;
    }

    if (role !== "super_admin") {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};
