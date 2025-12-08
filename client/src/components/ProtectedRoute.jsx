import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  console.log("ProtectedRoute check:", { user: !!user, loading });

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />
  }

  return children
}

