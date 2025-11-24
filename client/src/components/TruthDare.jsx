import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import "./TruthDare.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function TruthDare() {
    const { user } = useAuth();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(null); // 'truth' or 'dare'
    const [error, setError] = useState("");

    const fetchQuestion = async (selectedType) => {
        setLoading(true);
        setType(selectedType);
        setQuestion(null);
        setError("");

        try {
            const token = await user.getIdToken();
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

    const resetGame = () => {
        setQuestion(null);
        setType(null);
    };

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
                        <Button onClick={resetGame}>Next Turn</Button>
                    </div>
                </div>
            )}

            {error && <p className="error-text">{error}</p>}
        </div>
    );
}
