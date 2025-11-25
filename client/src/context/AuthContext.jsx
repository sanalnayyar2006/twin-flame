import React, { createContext, useContext, useState, useEffect } from "react"
import { onAuthChange, getCurrentUser, logout as firebaseLogout } from "../utils/auth"
import { authAPI } from "../utils/api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - use Firebase user data directly
        // Backend can be used for additional user data if needed
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        })

        // Optionally fetch additional user info from backend
        // This is done asynchronously and won't block the UI
        try {
          const response = await authAPI.getMe()
          if (response.user) {
            // Merge Firebase user with backend user data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              ...response.user,
            })
          }
        } catch (error) {
          // Backend call failed, but we still have Firebase user data
          console.warn("Could not fetch user info from backend:", error.message)
        }
      } else {
        // User is signed out
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await firebaseLogout()
      await authAPI.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

