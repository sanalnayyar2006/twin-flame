import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    const title = location.pathname.startsWith('/signup') 
      ? 'Sign up | TwinFlame' 
      : location.pathname.startsWith('/dashboard')
      ? 'Dashboard | TwinFlame'
      : 'Login | TwinFlame';
    document.title = title;
  }, [location.pathname]);

  return (
    <div className="app-container">
      <h1 className="app-title">TwinFlame</h1>
      <p className="app-subtitle">Connect as a couple</p>

      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" replace /> : <SignupForm />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}