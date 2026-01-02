import React, { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import "./QuestionsManager.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function QuestionsManager() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    
    // Filters
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        fetchQuestions();
    }, [page, type, category, search, sortBy, sortOrder]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const params = new URLSearchParams({
                page,
                limit,
                ...(type && { type }),
                ...(category && { category }),
                ...(search && { search }),
                sortBy,
                sortOrder
            });

            const res = await fetch(`${API_URL}/api/truthdare/questions?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                setQuestions(data.questions);
                setPagination(data.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch questions:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="questions-manager">
            <h1>Questions Manager</h1>
            
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                
                <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
                    <option value="">All Types</option>
                    <option value="truth">Truth</option>
                    <option value="dare">Dare</option>
                </select>
                
                <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                    <option value="">All Categories</option>
                    <option value="fun">Fun</option>
                    <option value="romantic">Romantic</option>
                    <option value="deep">Deep</option>
                    <option value="spicy">Spicy</option>
                </select>
                
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="createdAt">Date</option>
                    <option value="type">Type</option>
                    <option value="category">Category</option>
                </select>
                
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="questions-list">
                        {questions.map((q) => (
                            <div key={q._id} className="question-item">
                                <span className="badge">{q.type}</span>
                                <span className="badge">{q.category}</span>
                                <p>{q.text}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pagination">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {pagination.page} of {pagination.totalPages}</span>
                        <button 
                            disabled={page === pagination.totalPages} 
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
