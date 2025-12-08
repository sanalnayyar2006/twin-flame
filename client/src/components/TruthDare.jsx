import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import Button from "./ui/Button";
import confetti from "canvas-confetti";
import "./TruthDare.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function TruthDare() {
    const { user } = useAuth();
    const [isTurn, setIsTurn] = useState(null); // true, false, or null (loading)
    const [statusLoading, setStatusLoading] = useState(true);
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(null); // 'truth' or 'dare'
    const [error, setError] = useState("");

    // Poll for turn status
    React.useEffect(() => {
        const checkTurn = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;

                const res = await fetch(`${API_URL}/api/truthdare/status`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setIsTurn(data.isTurn);
            } catch (err) {
                console.error("Turn check failed", err);
            } finally {
                setStatusLoading(false);
            }
        };

        checkTurn();
        const interval = setInterval(checkTurn, 3000); // Check every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchQuestion = async (selectedType) => {
        setLoading(true);
        setType(selectedType);
        setQuestion(null);
        setError("");

        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${API_URL}/api/truthdare/random?type=${selectedType}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // Simulate a small delay for "spinning" effect
            setTimeout(() => {
                setQuestion(data);
                setLoading(false);
            }, 800);

        } catch (err) {
            console.error("Game Error:", err);
            setError("Failed to load question. Try again!");
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (type) fetchQuestion(type);
    };

    const completeTurn = async () => {
        try {
            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4b6e', '#ff8fa3', '#ffffff']
            });

            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            await fetch(`${API_URL}/api/truthdare/complete`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsTurn(false);
            setQuestion(null);
            setType(null);
        } catch (err) {
            console.error("Complete turn failed", err);
        }
    };

    if (statusLoading) {
        return (
            <div className="game-container">
                <div className="spinner">🎲</div>
                <p>Loading game...</p>
            </div>
        );
    }

    if (isTurn === false) {
        return (
            <div className="game-container">
                <h1 className="game-title">Truth or Dare</h1>
                <div className="waiting-card glass-card">
                    <span className="waiting-icon">⏳</span>
                    <h2>Waiting for Partner...</h2>
                    <p>It's their turn to spin the wheel!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <h1 className="game-title">Truth or Dare</h1>
            <p className="game-subtitle">Spin the wheel of destiny!</p>

            {!question && !loading && (
                <div className="choice-container">
                    <button
                        className="choice-card truth-card"
                        onClick={() => fetchQuestion("truth")}
                    >
                        <span className="choice-icon">🤫</span>
                        TRUTH
                    </button>
                    <button
                        className="choice-card dare-card"
                        onClick={() => fetchQuestion("dare")}
                    >
                        <span className="choice-icon">🔥</span>
                        DARE
                    </button>
                </div>
            )}

            {loading && (
                <div className="spinner-container">
                    <div className="spinner">🎲</div>
                    <p>Spinning...</p>
                </div>
            )}

            {question && (
                <div className={`question-card glass-card ${type}`}>
                    <div className="card-header">
                        <span className="badge">{type.toUpperCase()}</span>
                        <span className="badge category">{question.category}</span>
                    </div>
                    <h2 className="question-text">{question.text}</h2>

                    <div className="card-actions">
                        <Button onClick={handleNextQuestion} variant="secondary" className="action-btn">
                            Next Question 🔄
                        </Button>
                        <Button onClick={completeTurn} className="action-btn">
                            Complete Turn ✅
                        </Button>
                    </div>
                </div>
            )}

            {error && <p className="error-text">{error}</p>}
        </div>
    );
}
