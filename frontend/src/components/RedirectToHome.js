/**
 * This component is used to redirect to the home page if the user is already logged in.
 */

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RedirectToHome({ children }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/home" />;
    }

    return children;
}