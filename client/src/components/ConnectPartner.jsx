import React, { useState, useEffect } from "react";
import { userAPI } from "../utils/userApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import Input from "./ui/Input";
import "./ConnectPartner.css";

export default function ConnectPartner() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myCode, setMyCode] = useState("");
    const [partnerCode, setPartnerCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchCode() {
            try {
                const data = await userAPI.getPartnerCode();
                setMyCode(data.code);
            } catch (err) {
                console.error("Failed to fetch code", err);
                setError(err.message || "Failed to load code");
            }
        }
        fetchCode();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(myCode);
        alert("Code copied to clipboard!");
    };

    const handleLink = async (e) => {
        e.preventDefault();
        if (!partnerCode.trim()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = await userAPI.linkPartner(partnerCode);
            setSuccess(`Connected with ${data.partner.name || "your partner"}! Redirecting...`);
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            setError(err.message || "Failed to link partner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="connect-container">
            <div className="connect-card glass-card">
                <h2 className="connect-title">Link with your Twin Flame</h2>
                <p className="connect-desc">Share your code or enter your partner's code to connect.</p>

                <div className="code-display-section">
                    <p className="section-label">Your Unique Code</p>
                    <div className="code-box" onClick={handleCopy}>
                        {myCode ? (
                            <>
                                {myCode}
                                <span className="copy-icon">📋</span>
                            </>
                        ) : (
                            <span style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
                                {error ? "Error loading code" : "Loading..."}
                            </span>
                        )}
                    </div>
                    {error && !myCode && <p className="error-text" style={{ textAlign: 'center' }}>{error}</p>}
                </div>

                <div className="divider">OR</div>

                <form onSubmit={handleLink} className="link-form">
                    <p className="section-label">Enter Partner's Code</p>
                    <Input
                        value={partnerCode}
                        onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                        placeholder="e.g. X9Y2Z"
                        maxLength={5}
                    />

                    {error && <p className="error-text">{error}</p>}
                    {success && <p className="success-text">{success}</p>}

                    <Button type="submit" loading={loading} disabled={!partnerCode}>
                        Connect Partner
                    </Button>
                </form>
            </div>
        </div>
    );
}
