import { useSelector } from "react-redux";

export const useAuth = () => {
    const { isAuthenticated, user, role, isLoading } = useSelector(
        (state) => state.auth,
    );

    return {
        isAuthenticated,
        user,
        role,
        isLoading,
        isAdmin: ["admin", "super_admin"].includes(role),
        isSuperAdmin: role === "super_admin",
        isCustomer: role === "user",
        isGuest: !isAuthenticated,
    };
};

export const useRequireAuth = (requiredRole = null) => {
    const auth = useAuth();

    const hasAccess = () => {
        if (!auth.isAuthenticated) return false;
        if (!requiredRole) return true;
        if (requiredRole === "admin") return auth.isAdmin;
        if (requiredRole === "super_admin") return auth.isSuperAdmin;
        return auth.role === requiredRole;
    };

    return {
        ...auth,
        hasAccess: hasAccess(),
    };
};
