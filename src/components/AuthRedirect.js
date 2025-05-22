import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default AuthRedirect;
