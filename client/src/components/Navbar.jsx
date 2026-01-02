import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Theme State
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    // Apply theme to document
    React.useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-logo">
                    TwinFlame
                </Link>

                <div className="navbar-right">
                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle Dark Mode"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0 0.5rem',
                            boxShadow: 'none'
                        }}
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {/* Profile Icon */}
                    <div className="profile-icon">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}
                    </div>

                    {/* Burger Menu */}
                    <button
                        className={`burger-menu ${menuOpen ? "open" : ""}`}
                        onClick={toggleMenu}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <>
                        <div className="menu-overlay" onClick={closeMenu}></div>
                        <div className="dropdown-menu">
                            <Link to="/daily-tasks" className="dropdown-item" onClick={closeMenu}>
                                📋 Daily Tasks
                            </Link>
                            <Link to="/media" className="dropdown-item" onClick={closeMenu}>
                                📸 Gallery
                            </Link>
                            <Link to="/edit-profile" className="dropdown-item" onClick={closeMenu}>
                                👤 Profile
                            </Link>
                            <button
                                className="dropdown-item logout-item"
                                onClick={handleLogout}
                            >
                                <span className="dropdown-icon">🚪</span>
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
