import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, redirectPath }) => {
  const token = localStorage.getItem('authToken');

  // If token does not exist, redirect to the respective login page
  if (!token) {
    return <Navigate to={redirectPath} />;
  }

  // If token exists, render the children components
  return children;
};

export default ProtectedRoute;