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
  const [isVisible, setIsVisible] = useState(false)

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch partner info if connected
  useEffect(() => {
    const fetchPartner = async () => {
      if (user?.partnerId) {
        setLoadingPartner(true);
        try {
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
      desc: "Complete today's fun challenge with your partner!",
      action: "View Task",
      path: "/daily-tasks",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Truth & Dare",
      desc: "Spin the bottle and play a game of honesty or daring.",
      action: "Play Now",
      path: "/truth-dare",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Media Gallery",
      desc: "View and share your favorite memories together.",
      action: "View Gallery",
      path: "/media",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    }
  ]

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className={`dashboard-header glass-card ${isVisible ? 'animate-fadeInDown' : ''}`}>
          <div className="user-welcome">
            {user.partnerId && partner ? (
              <>
                <h2 className="greeting-text">Hi {user.name || user.displayName || user.email?.split('@')[0]} & {partner.name || partner.displayName || partner.email?.split('@')[0]}! 💕</h2>
                <p className="love-quote">"You know you're in love when you can't fall asleep because reality is finally better than your dreams."</p>
              </>
            ) : (
              <>
                <h2 className="greeting-text">Hello, {user.name || user.displayName || user.email?.split('@')[0]}! 👋</h2>
                <p>Ready to connect with your partner?</p>
              </>
            )}
            {!user.partnerId && (
              <button
                className="connect-partner-btn hover-lift"
                onClick={() => navigate('/connect')}
              >
                Not connected? Connect now
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card glass-card hover-lift ${isVisible ? 'animate-fadeInUp' : ''} stagger-${index + 1}`}
              style={{ '--card-gradient': feature.gradient }}
            >
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <Button
                className="action-btn hover-scale"
                onClick={() => navigate(feature.path)}
              >
                {feature.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
