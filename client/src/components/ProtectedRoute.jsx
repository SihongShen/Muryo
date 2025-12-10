import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // check
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        // if not, go to login
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;