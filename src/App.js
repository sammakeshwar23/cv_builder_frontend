import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/Auth/Login';
import RegisterPage from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Preview from './components/PreviewPage';
import MainLayout from './components/MainLayout';
import Layouts from "./pages/Layout";
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Editor />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Editor />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/preview/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Preview />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/layouts"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Layouts />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
