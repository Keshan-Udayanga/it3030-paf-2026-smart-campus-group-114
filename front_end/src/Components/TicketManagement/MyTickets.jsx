import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyTickets.css";

function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchMyTickets();
    }, []);

    const fetchMyTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            // For now fetching all, but in real app we filter by logged in user
            const res = await axios.get("http://localhost:8080/api/v1/tickets/my", {
                headers: { Authorization: `Bearer ${token}` }
                });
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching tickets:", err);
            setLoading(false);
        }
    };

    return (
        <div className="my-tickets-container">
            <div className="my-tickets-header">
                <h1>My Incident Tickets</h1>
                <p>Tickets submitted by you with latest status and quick access to details.</p>
                <button 
                    className="create-btn" 
                    onClick={() => navigate("/tickets/create")}
                >
                    Create New Ticket
                </button>
            </div>

            <div className="tickets-grid">
                {loading ? (
                    <div className="loading">Loading your tickets...</div>
                ) : tickets.length === 0 ? (
                    <div className="no-tickets">You haven't submitted any tickets yet.</div>
                ) : (
                    tickets.map((t) => (
                        <div key={t.id} className="ticket-card">
                            <div className="card-top">
                                <span className="ticket-code">{t.ticketCode}</span>
                                <span className={`status-pill ${t.status}`}>
                                    {t.status}
                                </span>
                            </div>
                            
                            <div className="card-body">
                                <p className="category-loc">
                                    {t.category.toUpperCase()} • {t.location}
                                </p>
                                <p className="created-at">
                                    Created: {new Date(t.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <button 
                                className="view-details-btn"
                                onClick={() => navigate(`/tickets/${t.id || t._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyTickets;
