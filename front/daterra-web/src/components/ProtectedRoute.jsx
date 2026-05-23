import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated, user, requiredUserType }) {
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user type matches required type
  if (requiredUserType !== undefined && user?.idTipoUsu !== requiredUserType) {
    // Redirect to appropriate default page based on user type
    const defaultRoute = user?.idTipoUsu === 2 ? '/mapCiudadano' : '/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
}

export default ProtectedRoute;
