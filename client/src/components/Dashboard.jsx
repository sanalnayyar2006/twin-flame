import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Button from "./ui/Button"
import Navbar from "./Navbar"
import { auth } from "../config/firebase"
import "./Dashboard.css"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [partner, setPartner] = useState(null)
  const [loadingPartner, setLoadingPartner] = useState(false)

  // Fetch partner info if connected
  useEffect(() => {
    const fetchPartner = async () => {
      if (user?.partnerId) {
        setLoadingPartner(true);
        try {
          // Get Firebase token
          const firebaseUser = auth.currentUser;
          if (!firebaseUser) {
            console.error("No Firebase user found");
            return;
          }

          const token = await firebaseUser.getIdToken();

          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user/partner`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          const data = await res.json();
          console.log("Partner data:", data);

          if (res.ok && data.partner) {
            setPartner(data.partner);
          } else {
            console.error("Failed to fetch partner:", data.message);
          }
        } catch (err) {
          console.error("Failed to fetch partner:", err);
        } finally {
          setLoadingPartner(false);
        }
      }
    };
    fetchPartner();
  }, [user?.partnerId]);

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
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header glass-card">
          <div className="user-welcome">
            {user.partnerId && partner ? (
              <>
                <h2>Hi {user.name || user.displayName || user.email?.split('@')[0]} & {partner.name || partner.displayName || partner.email?.split('@')[0]}! 💕</h2>
                <p className="love-quote">"You know you're in love when you can't fall asleep because reality is finally better than your dreams."</p>
              </>
            ) : (
              <>
                <h2>Hello, {user.name || user.displayName || user.email?.split('@')[0]}! 👋</h2>
                <p>Ready to connect with your partner?</p>
              </>
            )}
            {!user.partnerId && (
              <button
                className="connect-partner-btn"
                onClick={() => navigate('/connect')}
              >
                Not connected? Connect now
              </button>
            )}
          </div>
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
    </>
  )
}
