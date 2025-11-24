import React from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Button from "./ui/Button"
import "./Dashboard.css"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  if (!user) {
    return <div className="loading">Loading...</div>
  }

  const features = [
    {
      title: "Daily Task",
      icon: "📅",
      desc: "Complete today's fun challenge with your partner!",
      action: "View Task",
      path: "/tasks"
    },
    {
      title: "Truth & Dare",
      icon: "🎲",
      desc: "Spin the bottle and play a game of honesty or daring.",
      action: "Play Now",
      path: "/truth-dare"
    },
    {
      title: "Chat",
      icon: "💬",
      desc: "Private secure messaging with your twin flame.",
      action: "Open Chat",
      path: "/chat"
    },
    {
      title: "Media Gallery",
      icon: "📸",
      desc: "Your shared album of memories and voice notes.",
      action: "View Gallery",
      path: "/media"
    }
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-card">
        <div className="user-welcome">
          <h2>Hello, {user.displayName || user.email?.split('@')[0]}! 👋</h2>
          <p>Ready to connect with your partner?</p>
        </div>
        <Button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          Logout
        </Button>
      </div>

      <div className="dashboard-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card glass-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
            <Button className="action-btn" onClick={() => navigate(feature.path)}>
              {feature.action}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

