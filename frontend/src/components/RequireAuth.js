/**
 * This component is used to wrap components that require authentication. 
 * It redirects users if they are not logged in.
 */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
}