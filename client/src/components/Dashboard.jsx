import React from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Button from "./ui/Button"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <div style={{ marginTop: "2rem" }}>
        <p>User ID: {user.uid}</p>
        <p>Email Verified: {user.emailVerified ? "Yes" : "No"}</p>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}

